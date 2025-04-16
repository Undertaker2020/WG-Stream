import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TotpService} from './totp.service';
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {User} from "@prisma/generated";
import {TotpModel} from "@/src/modules/auth/totp/models/totp.model";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {EnableTotpInput} from "@/src/modules/auth/totp/inputs/enable-totp.input";

@Resolver('Totp')
export class TotpResolver {
    constructor(private readonly totpService: TotpService) {
    }

    @Authorization()
    @Query(() => TotpModel, {name: 'generateTotpSecret'})
    public async generate(@Authorized() user: User) {
        return this.totpService.generate(user)
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'enableTotp'})
    public async enable(
        @Authorized() user: User,
        @Args('data') input: EnableTotpInput
    ) {
        return this.totpService.enable(user, input)
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'disableTotp'})
    public async disable(
        @Authorized() user: User
    ) {
        return this.totpService.disable(user)
    }
}
