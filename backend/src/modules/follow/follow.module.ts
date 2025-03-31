import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import {NotificationService} from "@/src/modules/notification/notification.service";

@Module({
  providers: [FollowResolver, FollowService, NotificationService],
})
export class FollowModule {}
