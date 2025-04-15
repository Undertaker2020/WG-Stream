import {Module} from '@nestjs/common';
import {CronService} from './cron.service';
import {ScheduleModule} from "@nestjs/schedule";
import {NotificationService} from "@/src/modules/notification/notification.service";

@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [CronService, NotificationService],
})
export class CronModule {
}
