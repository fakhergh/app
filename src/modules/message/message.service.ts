import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { UserType } from '../common/types/user.type';
import { Message, MessageType } from './message.schema';
import { MessageConnectionInput } from './message.type';

interface BaseMessageData {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderType: UserType.CUSTOMER | UserType.SERVICE_PROVIDER;
}

export interface CreateBookingHistoryMessageData extends BaseMessageData {
  bookingHistoryId: Types.ObjectId;
}

@Injectable()
export class MessageService extends FieldService<Message> {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {
    super({
      conversationId: { type: FieldType.ID },
    });
  }

  async createBookingHistoryMessage({ bookingHistoryId, ...data }: CreateBookingHistoryMessageData) {
    return this.messageModel.create({
      ...data,
      type: MessageType.BOOKING_HISTORY,
      content: {
        bookingHistoryId: bookingHistoryId,
      },
    });
  }

  async getMessagesCursorPagination(connectionArgs: ConnectionArgs, input: MessageConnectionInput) {
    const filter = this.configureFilters({}, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.messageModel.countDocuments(countFilter),
      this.messageModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  getLastMessage(conversationId: Types.ObjectId | string) {
    const filter = this.configureFilters({}, { conversationId: { eq: conversationId } });

    const sortOptions: { [key: string]: SortOrder } = { createdAt: -1 };

    return this.messageModel.findOne(filter).sort(sortOptions).lean();
  }
}
