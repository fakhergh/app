import { Args, Query, Resolver } from '@nestjs/graphql';

import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { ConnectionArgs } from '@/modules/common/types/query.type';
import { Notification } from '@/modules/notification/notification.schema';
import { NotificationService } from '@/modules/notification/notification.service';
import { NotificationConnection } from '@/modules/notification/notification.type';

@Resolver()
export class NotificationResolver extends NodeResolver<Notification> {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  @Query(() => NotificationConnection)
  async notificationsConnection(@Args() connectionArgs: ConnectionArgs) {
    return this.notificationService.getPaginatedNotifications(connectionArgs);
  }
}
