import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {PasswordRecoverService} from './password-recover.service';
import type {GqlContext} from "@/src/shared/types/gql-context.types";
import {UserAgent} from "@/src/shared/decorators/user-agent.decorator";
import {ResetPasswordInput} from "@/src/modules/auth/password-recover/inputs/reset-password.input";
import {NewPasswordInput} from "@/src/modules/auth/password-recover/inputs/new-password.input";

@Resolver('PasswordRecover')
export class PasswordRecoverResolver {
    public constructor(private readonly passwordRecoverService: PasswordRecoverService) {
    }

    @Mutation(() => Boolean, {name: 'resetPassword'})
    public async resetPassword(
        @Context() {req}: GqlContext,
        @Args('data') input: ResetPasswordInput,
        @UserAgent() userAgent: string
    ) {
        return this.passwordRecoverService.resetPassword(req, input, userAgent);
    }

    @Mutation(() => Boolean, {name: 'newPassword'})
    public async newPassword(
        @Args('data') input: NewPasswordInput,
    ) {
        return this.passwordRecoverService.newPassword(input);
    }


}
