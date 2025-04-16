import type {ApolloDriverConfig} from "@nestjs/apollo";
import {ConfigService} from "@nestjs/config";
import {isDev} from "../../shared/utils/is-dev.util";
import {join} from "path"

export function getGraphQlConfig(configService: ConfigService): ApolloDriverConfig {
    return {
        playground: isDev(configService),
        path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
        autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
        sortSchema: true,
        context: ({req, res}) => ({req, res}),
        installSubscriptionHandlers: true
    }
}