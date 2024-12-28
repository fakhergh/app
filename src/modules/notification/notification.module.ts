import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationResolver } from '@/modules/notification/notification.resolver';
import { Notification, NotificationSchema } from '@/modules/notification/notification.schema';
import { NotificationService } from '@/modules/notification/notification.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
