import {Injectable} from '@nestjs/common';
import {MailService} from "@/src/modules/libs/mail/mail.service";
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {Cron} from "@nestjs/schedule";
import {StorageService} from "@/src/modules/libs/storage/storage.service";
import {TelegramService} from "@/src/modules/libs/telegram/telegram.service";

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly storageService: StorageService,
        private readonly telegramService: TelegramService,
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
            },
            include: {
                notificationSettings: true,
                stream: true,
            }
        })

        for (const user of deactivatedAccounts) {
            await this.mailService.sendAccountDeletion(user.email)

            if(user.notificationSettings?.telegramNotifications && user.telegramId){
                await this.telegramService.sendAccountDeletion(user.telegramId)
            }

            this.storageService.remove(user.avatar as string)

            if(user.avatar){
                this.storageService.remove(user.avatar)
            }

            if(user.stream?.thumbnailUrl){
                this.storageService.remove(user.stream.thumbnailUrl)
            }


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
