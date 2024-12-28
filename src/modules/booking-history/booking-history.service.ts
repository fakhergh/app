import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { BookingHistory, BookingHistoryStatusType } from './booking-history.schema';
import { BookingHistoryConnectionInput, BookingHistoryFilterInput } from './booking-history.type';

export class CreateBookingHistoryData {
  bookingId: string | Types.ObjectId;
  status: BookingHistoryStatusType;
  metadata?: Map<string, any>;
}

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  bookingId: { type: FieldType.ID },
  status: { type: FieldType.ENUM },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
};

@Injectable()
export class BookingHistoryService extends FieldService<BookingHistory> {
  constructor(@InjectModel(BookingHistory.name) private readonly bookingHistoryModel: Model<BookingHistory>) {
    super(filterConfigOptions);
  }

  async createBookingHistory(data: CreateBookingHistoryData) {
    return this.bookingHistoryModel.create(data);
  }

  async getPaginatedBookingHistories(
    connectionArgs: ConnectionArgs | null,
    input: BookingHistoryConnectionInput & ConnectionArgs,
  ) {
    const filter = this.configureFilters({}, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.bookingHistoryModel.countDocuments(countFilter),
      this.bookingHistoryModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  async getBookingHistory(filterInput: BookingHistoryFilterInput) {
    const filter: FilterQuery<BookingHistory> = this.configureFilters({}, filterInput);

    return this.bookingHistoryModel.findOne(filter).lean();
  }
}
