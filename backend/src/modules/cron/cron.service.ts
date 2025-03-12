import {Injectable} from '@nestjs/common';
import {MailService} from "@/src/modules/libs/mail/mail.service";
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {Cron} from "@nestjs/schedule";
import {StorageService} from "@/src/modules/libs/storage/storage.service";

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly storageService: StorageService,
    ) {}

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
            this.storageService.remove(user.avatar as string)
        }

        // console.log(
        //     'deactivated accounts - deactivated', deactivatedAccounts
        // )

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
