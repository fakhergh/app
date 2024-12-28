import { ObjectType, registerEnumType } from '@nestjs/graphql';

import { createConnection } from '@/modules/common/types/query.type';
import { Notification, NotificationAction } from '@/modules/notification/notification.schema';

registerEnumType(NotificationAction, { name: 'NotificationAction' });

@ObjectType()
export class NotificationConnection extends createConnection(Notification) {}
