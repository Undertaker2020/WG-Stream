import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {SessionService} from './session.service';
import {UserModel} from "@/src/modules/auth/account/models/user.model";
import type {GqlContext} from "@/src/shared/types/gql-context.types";
import {LoginInput} from "@/src/modules/auth/session/inputs/login.input";
import {UserAgent} from "@/src/shared/decorators/user-agent.decorator";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {SessionModel} from "@/src/modules/auth/session/models/session.model";

@Resolver('Session')
export class SessionResolver {
    public constructor(private readonly sessionService: SessionService) {
    }

    @Authorization()
    @Query(() => [SessionModel], {name: 'findSessionByUser'})
    public async findByUser(@Context() {req}: GqlContext) {
        return this.sessionService.findByUser(req);
    }

    @Authorization()
    @Query(() => SessionModel, {name: 'findCurrentSession'})
    public async findCurrent(@Context() {req}: GqlContext) {
        return this.sessionService.findCurrent(req);
    }

    @Mutation(() => UserModel, {name: 'login'})
    public async login(
        @Context() {req}: GqlContext,
        @Args('data') input: LoginInput,
        @UserAgent() userAgent: string
    ) {
      return this.sessionService.login(req, input, userAgent);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'logout'})
    public async logout(
      @Context() {req}: GqlContext
    ) {
        return this.sessionService.logout(req);
    }

    @Mutation(() => Boolean, {name: 'clearSessionCookie'})
    public async clearSession(
        @Context() {req}: GqlContext
    ) {
        return this.sessionService.clearSession(req);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'removeSession'})
    public async removeSession(
        @Context() {req}: GqlContext, @Args('id') id: string
    ) {
        return this.sessionService.removeSession(req, id);
    }
}
