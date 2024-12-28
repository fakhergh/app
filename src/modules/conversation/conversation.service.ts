import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { Conversation } from './conversation.schema';
import { ConversationConnectionInput, ConversationFilterInput } from './conversation.type';

export interface CreateConversationData {
  customerId: Types.ObjectId;
  serviceProviderId: Types.ObjectId;
  bookingId: Types.ObjectId;
}

@Injectable()
export class ConversationService extends FieldService<Conversation> {
  constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {
    super({
      id: { type: FieldType.ID, overrideFieldName: '_id' },
      customerId: { type: FieldType.ID },
      serviceProviderId: { type: FieldType.ID },
      archived: { type: FieldType.BOOLEAN },
    });
  }

  async createConversation(data: CreateConversationData) {
    return this.conversationModel.create(data);
  }

  async getConversation(filterInput: ConversationFilterInput) {
    const filter = this.configureFilters({}, filterInput);

    return this.conversationModel.findOne(filter);
  }

  async getConversationsCursorPagination(connectionArgs: ConnectionArgs | null, input: ConversationConnectionInput) {
    const filter = this.configureFilters({}, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.conversationModel.countDocuments(countFilter),
      this.conversationModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }
}
