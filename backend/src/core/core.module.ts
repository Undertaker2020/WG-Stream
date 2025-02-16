import {Module} from '@nestjs/common';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {IS_DEV_ENV} from "@/src/shared/utils/is-dev.util";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {getGraphQlConfig} from "@/src/core/config/graphql.config";
import {RedisModule} from './redis/redis.module';
import {AccountModule} from "@/src/modules/auth/account/account.module";

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
        PrismaModule,
        RedisModule,
        AccountModule
    ],
})
export class CoreModule {
}
