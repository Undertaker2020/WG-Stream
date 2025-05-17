import {Field, ID, ObjectType} from "@nestjs/graphql";
import type {Stream} from "@prisma/generated";
import {UserModel} from "@/src/modules/auth/account/models/user.model";
import {CategoryModel} from "@/src/modules/category/models/category.model";
import {ChatMessageModel} from "@/src/modules/chat/models/chat-message.model";

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
    public id: string;

    @Field(() => String)
    public title: string;

    @Field(() => String, {nullable: true})
    public thumbnailUrl: string;

    @Field(() => String, {nullable: true})
    public ingressId: string;

    @Field(() => String, {nullable: true})
    public serverUrl: string;

    @Field(() => String, {nullable: true})
    public streamKey: string;

    @Field(() => Boolean)
    public isLive: boolean;

    @Field(()=> UserModel)
    public user: UserModel;

    @Field(() => String)
    public userId: string;

    @Field(() => Date)
    public createdAt: Date;

    @Field(() => Date)
    public updatedAt: Date;

    @Field(() => CategoryModel, { nullable: true })
    public category: CategoryModel;

    @Field(() => String, { nullable: true })
    public categoryId: string;

    @Field(() => Boolean)
    public isChatEnabled: boolean;

    @Field(() => Boolean)
    public isChatFollowersOnly: boolean;

    @Field(() => Boolean)
    public isChatPremiumFollowersOnly: boolean;

    @Field(() => [ChatMessageModel])
    public chatMessages: ChatMessageModel[];
}