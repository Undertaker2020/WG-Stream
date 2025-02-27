import {Injectable} from '@nestjs/common';
import {MailService} from "@/src/modules/libs/mail/mail.service";
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {
    }

    @Cron('0 0 * * *')
    public async deleteDeactivateAccounts() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const deactivatedAccounts = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo,
                }
            }
        })

        for (const user of deactivatedAccounts) {
            await this.mailService.sendAccountDeletion(user.email)
        }

        console.log(
            'deactivated accounts - deactivated', deactivatedAccounts
        )

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo,
                }
            }
        })
    }
}
