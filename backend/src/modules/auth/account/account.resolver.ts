import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import { AccountService } from './account.service';
import {UserModel} from "@/src/modules/auth/account/models/user.model";
import {CreateUserInput} from "@/src/modules/auth/account/inputs/create-user.input";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import type {User} from "@prisma/generated";
import {ChangeEmailInput} from "@/src/modules/auth/account/inputs/change-email.input";
import {ChangePasswordInput} from "@/src/modules/auth/account/inputs/change-password.input";

@Resolver('Account')
export class AccountResolver {
  public constructor(
      private readonly accountService: AccountService
  ) {}

  @Authorization()
  @Query(()=> UserModel, {name: 'findProfile'})
  public async me(
      @Authorized('id') id: string
  ){
    return this.accountService.me(id)
  }

  @Mutation(()=> Boolean, {name: 'createUser'})
  public async create(
      @Args('data') input: CreateUserInput
  ){
      return this.accountService.create(input)
  }

  @Authorization()
  @Mutation(()=> Boolean, {name: 'changeEmail'})
  public async changeEmail(
      @Authorized() user: User,
      @Args('data') input: ChangeEmailInput
  ){
    return this.accountService.changeEmail(user, input)
  }

  @Authorization()
  @Mutation(()=> Boolean, {name: 'changePassword'})
  public async changePassword(
      @Authorized() user: User,
      @Args('data') input: ChangePasswordInput
  ){
    return this.accountService.changePassword(user, input)
  }
}
