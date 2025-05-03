import {TypeStripeOptions} from "@/src/modules/libs/stripe/types/stripe.types";
import {ConfigService} from "@nestjs/config";

export function getStripeConfig(configService: ConfigService): TypeStripeOptions {
    return {
        apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
        config: {
            apiVersion: '2025-04-30.basil'
        }
    }
}