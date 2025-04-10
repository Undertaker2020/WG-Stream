import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TransactionService} from './transaction.service';
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {TransactionModel} from "@/src/modules/sponsorship/transaction/models/transaction.model";
import type {User} from "@prisma/generated";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {MakePaymentModel} from "@/src/modules/sponsorship/transaction/models/make-payment.model";

@Resolver('Transaction')
export class TransactionResolver {
    public constructor(
        private readonly transactionService: TransactionService,
    ) {
    }

    @Authorization()
    @Query(() => [TransactionModel], {name: 'findMyTransactions'})
    private async findMyTransactions(
        @Authorized() user: User,
    ) {
        return this.transactionService.findMyTransactions(user)
    }

    @Authorization()
    @Mutation(() => MakePaymentModel, {name: 'makePayment'})
    public async makePayment(
        @Authorized() user: User,
        @Args('planId') planId: string,
    ) {
        return this.transactionService.makePayment(user, planId)
    }
}
