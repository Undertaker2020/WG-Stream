import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {NotificationService} from './notification.service';
import {Authorized} from "@/src/shared/decorators/authorized.decorator";
import type {User} from "@prisma/generated";
import {Authorization} from "@/src/shared/decorators/auth.decorator";
import {NotificationModel} from "@/src/modules/notification/models/notification.model";
import {ChangeNotificationsSettingsResponse} from "@/src/modules/notification/models/notification-settings.model";
import {ChangeNotificationsSettingsInput} from "@/src/modules/notification/inputs/change-notifications-settings.input";

@Resolver('Notification')
export class NotificationResolver {
    public constructor(private readonly notificationService: NotificationService) {
    }

    @Authorization()
    @Query(() => Number, {name: 'findNotificationUnreadCount'})
    public async findUnreadCount(
        @Authorized() user: User
    ) {
        return this.notificationService.findUnreadCount(user);
    }

    @Authorization()
    @Query(() => [NotificationModel], {name: 'findNotificationByUser'})
    public async findByUser(
        @Authorized() user: User
    ) {
        return this.notificationService.findByUser(user);
    }

    @Authorization()
    @Mutation(() => ChangeNotificationsSettingsResponse, {name: 'changeNotificationsSettings'})
    public async changeSettings(
        @Authorized() user: User,
        @Args('data') input: ChangeNotificationsSettingsInput
    ) {
        return this.notificationService.changeSettings(user, input);
    }
}
