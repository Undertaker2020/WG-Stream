import { Args, Query, Resolver} from '@nestjs/graphql';
import {ChannelService} from './channel.service';
import {UserModel} from "@/src/modules/auth/account/models/user.model";

@Resolver('Channel')
export class ChannelResolver {
    public constructor(private readonly channelService: ChannelService) {}

    @Query(()=> [UserModel], { name: 'findRecommendedChannels'})
    public async findRecommendedChannels(){
        return await this.channelService.findRecommendedChannels();
    }

    @Query(()=> UserModel, { name: 'findChannelByUsername' })
    public async findByUsername(
        @Args('username') username: string,
    ){
        return await this.channelService.findByUsername(username);
    }

    @Query(()=> Number, { name: 'findFollowersCountByChannel' })
    public async findFollowersCountByChannel(
        @Args('channelId') channelId: string,
    ){
        return this.channelService.findFollowersCountByChannel(channelId)
    }
}
