import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {UserAgent} from "@/src/shared/decorators/user-agent.decorator";
import {DeactivateService} from "@/src/modules/auth/deactivate/deactivate.service";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {AuthModel} from "@/src/modules/auth/account/models/auth.model";
import {GqlContext} from "@/src/shared/types/gql-context.types";
import {DeactivateAccountInput} from "@/src/modules/auth/deactivate/inputs/deactivate-account.input";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {User} from "@prisma/generated";

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {}

  @Authorization()
  @Mutation(() => AuthModel, { name: 'deactivateAccount' })
  public async deactivate(
      @Context() { req }: GqlContext,
      @Args('data') input: DeactivateAccountInput,
      @Authorized() user: User,
      @UserAgent() userAgent: string
  ) {
    return this.deactivateService.deactivate(req, input, user, userAgent)
  }
}
