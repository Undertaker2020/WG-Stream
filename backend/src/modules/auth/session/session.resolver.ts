import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {SessionService} from './session.service';
import {UserModel} from "@/src/modules/user.model";
import type {GqlContext} from "@/src/shared/types/gql-context.types";
import {LoginInput} from "@/src/modules/auth/session/inputs/login.input";

@Resolver('Session')
export class SessionResolver {
    public constructor(private readonly sessionService: SessionService) {
    }

    @Mutation(() => UserModel, {name: 'login'})
    public async login(
        @Context() {req}: GqlContext,
        @Args('data') input: LoginInput
    ) {
      return this.sessionService.login(req, input);
    }

  @Mutation(() => Boolean, {name: 'logout'})
  public async logout(
      @Context() {req}: GqlContext
  ) {
    return this.sessionService.logout(req);
  }
}
