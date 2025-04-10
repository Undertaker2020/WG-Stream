import {SponsorshipSubscription, TransactionStatus} from "@prisma/generated";
import {Field, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {UserModel} from "@/src/modules/auth/account/models/user.model";
import {PlanModel} from "@/src/modules/sponsorship/plan/models/plan.model";

registerEnumType(TransactionStatus, {
    name: "TransactionStatus",
})

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
    @Field(() => ID)
    public id: string;

    @Field(() => Date)
    public expiresAt: Date;

    @Field(() => PlanModel)
    public plan: PlanModel;

    @Field(() => String)
    public planId: string;

    @Field(() => UserModel)
    public user: UserModel;

    @Field(() => String)
    public userId: string;

    @Field(() => UserModel)
    public channel: UserModel;

    @Field(() => String)
    public channelId: string;

    @Field(() => Date)
    public createdAt: Date;

    @Field(() => Date)
    public updatedAt: Date;
}