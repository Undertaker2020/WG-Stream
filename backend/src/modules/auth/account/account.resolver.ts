import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import { AccountService } from './account.service';
import {UserModel} from "@/src/modules/auth/account/models/user.model";
import {CreateUserInput} from "@/src/modules/auth/account/inputs/create-user.input";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {Authorization} from "@/src/shared/decorators/auth.decorator";

@Resolver('Account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(()=> UserModel, {name: 'findProfile'})
  public async me(@Authorized('id') id: string){
    return this.accountService.me(id)
  }

  @Mutation(()=> Boolean, {name: 'createUser'})
  public async create(@Args('data') input: CreateUserInput){
      return this.accountService.create(input)
  }
}
