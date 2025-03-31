import {type MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {WebhookService} from './webhook.service';
import {WebhookController} from './webhook.controller';
import {RawBodyMiddleware} from "@/src/shared/middlewares/raw-body.middleware";
import {NotificationService} from "@/src/modules/notification/notification.service";

@Module({
    controllers: [WebhookController],
    providers: [WebhookService, NotificationService],
})
export class WebhookModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(RawBodyMiddleware).forRoutes(
            {path: 'webhook/livekit', method: RequestMethod.POST}
        )
    }
}
