import {Inject, Injectable} from '@nestjs/common';
import Stripe from "stripe";
import {StripeOptionsSymbol, TypeStripeOptions} from "@/src/modules/libs/stripe/types/stripe.types";

@Injectable()
export class StripeService extends Stripe {
    public constructor(
        @Inject(StripeOptionsSymbol) private readonly options: TypeStripeOptions,
    ) {
        super(options.apiKey, options.config);
    }
}
