import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {FollowService} from './follow.service';
import {FollowModel} from "@/src/modules/follow/models/follow.model";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {User} from "@prisma/generated";

@Resolver('Follow')
export class FollowResolver {
    public constructor(private readonly followService: FollowService) {
    }

    @Authorization()
    @Query(() => [FollowModel], {name: 'findMyFollowers'})
    public async findMyFollowers(
        @Authorized() user: User
    ) {
        return this.followService.findMyFollowers(user);
    }

    @Authorization()
    @Query(() => [FollowModel], {name: 'findMyFollowings'})
    public async findMyFollowings(
        @Authorized() user: User
    ) {
        return this.followService.findMyFollowings(user);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'followChannel'})
    public async followChannel(
        @Authorized() user: User,
        @Args('channelId') channelId: string
    ) {
        return this.followService.follow(user, channelId);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: 'unfollowChannel'})
    public async unfollowChannel(
        @Authorized() user: User,
        @Args('channelId') channelId: string
    ) {
        return this.followService.unfollow(user, channelId);
    }
}
