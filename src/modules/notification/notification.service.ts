import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

import { PaginationFactory } from '@/common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '@/modules/common/services/field.service';
import { ConnectionArgs } from '@/modules/common/types/query.type';
import { Notification } from '@/modules/notification/notification.schema';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
};

@Injectable()
export class NotificationService extends FieldService<Notification> {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {
    super(filterConfigOptions);
  }

  async getPaginatedNotifications(connectionArgs: ConnectionArgs | null) {
    const filter = this.configureFilters({}, {});
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.notificationModel.countDocuments(countFilter),
      this.notificationModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }
}
