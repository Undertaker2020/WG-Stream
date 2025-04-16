import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {ChatService} from './chat.service';
import {PubSub} from "graphql-subscriptions";
import {ChatMessageModel} from "@/src/modules/chat/models/chat-message.model";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import {User} from "@prisma/generated";
import {ChangeChatSettingsInput} from "@/src/modules/chat/inputs/change-chat-settings.input";
import {SendMessageInput} from "@/src/modules/chat/inputs/send-message.input";

@Resolver('Chat')
export class ChatResolver {
    private readonly pubSub: PubSub;

    public constructor(private readonly chatService: ChatService) {
        this.pubSub = new PubSub();
    }

    @Query(() => [ChatMessageModel], {name: 'findChatMessagesByStream'})
    public async findMessagesByStream(@Args('streamId') streamId: string) {
        return this.chatService.findMessagesByStream(streamId);
    }

    @Authorization()
    @Mutation(() => Boolean, {name: "changeChatSettings"})
    public async changeSettings(
        @Authorized() user: User,
        @Args('data') input: ChangeChatSettingsInput
    ) {
        return this.chatService.changeSettings(user, input);
    }

    @Authorization()
    @Mutation(() => ChatMessageModel, {name: 'sendChatMessage'})
    public async sendMessage(
        @Authorized('id') userId: string,
        @Args('data') input: SendMessageInput
    ) {
        const message = await this.chatService.sendMessage(userId, input);

        await this.pubSub.publish('CHAT_MESSAGE_ADDED', {chatMessageAdded: message});

        return message;
    }

    @Subscription(() => ChatMessageModel, {
        name: 'chatMessageAdded', filter:
            (payload, variables) => payload.chatMessageAdded.streamId === variables.streamId
    })
    public chatMessageAdded(
        @Args('streamId') streamId: string,
    ) {
        return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
    }
}
