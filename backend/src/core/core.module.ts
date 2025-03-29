import {Module} from '@nestjs/common';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {IS_DEV_ENV} from "@/src/shared/utils/is-dev.util";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {getGraphQlConfig} from "@/src/core/config/graphql.config";
import {RedisModule} from './redis/redis.module';
import {AccountModule} from "@/src/modules/auth/account/account.module";
import {SessionModule} from "@/src/modules/auth/session/session.module";
import {VerificationModule} from "@/src/modules/auth/verification/verification.module";
import {MailModule} from "@/src/modules/libs/mail/mail.module";
import {PasswordRecoverModule} from "@/src/modules/auth/password-recover/password-recover.module";
import {TotpModule} from "@/src/modules/auth/totp/totp.module";
import {DeactivateModule} from "@/src/modules/auth/deactivate/deactivate.module";
import {CronModule} from "@/src/modules/cron/cron.module";
import {StorageModule} from "@/src/modules/libs/storage/storage.module";
import {ProfileModule} from "@/src/modules/auth/profile/profile.module";
import {StreamModule} from "@/src/modules/stream/stream.module";
import {LiveKitModule} from "@/src/modules/libs/livekit/livekit.module";
import {getLiveKitConfig} from "@/src/core/config/livekit.config";
import {IngressModule} from "@/src/modules/stream/ingress/ingress.module";
import {WebhookModule} from "@/src/modules/webhook/webhook.module";
import {CategoryModule} from "@/src/modules/category/category.module";
import {ChatModule} from "@/src/modules/chat/chat.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            useFactory: getGraphQlConfig,
            inject: [ConfigService],
        }),
        LiveKitModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getLiveKitConfig,
            inject: [ConfigService],
        }),
        PrismaModule,
        RedisModule,
        MailModule,
        AccountModule,
        SessionModule,
        VerificationModule,
        PasswordRecoverModule,
        TotpModule,
        DeactivateModule,
        CronModule,
        StorageModule,
        ProfileModule,
        StreamModule,
        LiveKitModule,
        IngressModule,
        WebhookModule,
        CategoryModule,
        ChatModule,
    ],
})
export class CoreModule {
}
