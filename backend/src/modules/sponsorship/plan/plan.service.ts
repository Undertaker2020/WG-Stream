import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {StripeService} from "@/src/modules/libs/stripe/stripe.service";
import {PrismaService} from "@/src/core/prisma/prisma.service";
import type {User} from "@prisma/generated";
import {CreatePlanInput} from "@/src/modules/sponsorship/plan/inputs/create-plan.input";

@Injectable()
export class PlanService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly stripeService: StripeService,
    ) {}

    public async findMyPlans(user: User){
        const plans = await this.prismaService.sponsorshipPlan.findMany({
            where: {
                channelId: user.id,
            }
        })

        return plans;
    }

    public async create( user: User, input: CreatePlanInput){
        const {title, description, price} = input;

        const channelId = await this.prismaService.user.findUnique({
            where: {
                id: user.id,
            }
        })

        if (!channelId?.isVerified) {
            throw new ForbiddenException('Plan creation is only available to verified channels');
        }

        const stripePlan = await this.stripeService.plans.create({
            amount: Math.round(price * 100),
            currency: 'usd',
            interval: 'month',
            product: {
                name: title
            }
        })

        await this.prismaService.sponsorshipPlan.create({
            data: {
                title,
                description,
                price,
                stripeProductId: stripePlan.product!.toString(),
                stripePlanId: stripePlan.id,
                channel: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        return true
    }

    public async remove(planId: string){
        const plan = await this.prismaService.sponsorshipPlan.findUnique({
            where: {
                id: planId,
            }
        })

        if (!plan) {
            throw new NotFoundException('Plan not found');
        }

        await this.stripeService.plans.del(plan.stripePlanId)
        await this.stripeService.products.del(plan.stripeProductId)

        await this.prismaService.sponsorshipPlan.delete({
            where: {
                id: planId
            }
        })

        return true
    }
}
