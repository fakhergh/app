import { Args, Query, Resolver } from '@nestjs/graphql';

import { NodeResolver } from '../common/resolvers/node.resolver';
import { ConnectionArgs } from '../common/types/query.type';
import { Notification } from '../notification/notification.schema';
import { NotificationService } from '../notification/notification.service';
import { NotificationConnection } from '../notification/notification.type';

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
