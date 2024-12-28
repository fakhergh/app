import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, PipelineStage, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { Category } from '../category/category.schema';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { Booking, BookingStatusType } from './booking.schema';
import { BookingConnectionInput, BookingFilterInput, CreateBookingInput, UpdateBookingInput } from './booking.type';

export class CreateBookingData extends CreateBookingInput {
  customerId: string | Types.ObjectId;
}

export class UpdateBookingData extends UpdateBookingInput {
  customerId: string | Types.ObjectId;
}

export class AcceptBookingData {
  id: string | Types.ObjectId;
  serviceProviderId: string | Types.ObjectId;
}

export class CancelBookingData {
  id: string | Types.ObjectId;
  userId: string | Types.ObjectId;
}

export class GetBookingOptions {
  id?: string | Types.ObjectId;
  serviceProviderId?: string | Types.ObjectId;
  customerId?: string | Types.ObjectId;
  status?: BookingStatusType[];
}

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID },
  customerId: { type: FieldType.ID },
  serviceProviderId: { type: FieldType.ID },
  status: { type: FieldType.ENUM },
  dateTime: { type: FieldType.DATE },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
};

@Injectable()
export class BookingService extends FieldService<Booking> {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(filterConfigOptions);
  }

  async getBookingsCount() {
    return this.bookingModel.countDocuments();
  }

  async getBookingCountByCategory() {
    const pipeline: PipelineStage[] = [
      { $match: { deleted: { $ne: true } } },
      { $lookup: { from: 'bookings', as: 'bookings', localField: '_id', foreignField: 'category' } },
      { $group: { _id: { id: '$_id', name: '$name', icon: '$icon', bookingCount: { $size: '$bookings' } } } },
      { $project: { _id: 0, id: '$_id.id', name: '$_id.name', icon: '$_id.icon', bookingCount: '$_id.bookingCount' } },
      { $sort: { bookingCount: -1, name: 1 } },
    ];

    return this.categoryModel.aggregate(pipeline);
  }

  async getPaginatedBookings(connectionArgs: ConnectionArgs | null, input: BookingConnectionInput) {
    const filter = this.configureFilters({}, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.bookingModel.countDocuments(countFilter),
      this.bookingModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  async getBooking(filterInput: BookingFilterInput): Promise<HydratedDocument<Booking> | null> {
    const filter: FilterQuery<Booking> = this.configureFilters({}, filterInput);

    if (Array.isArray(filterInput.status)) filter.status = { $in: filterInput.status };

    return this.bookingModel.findOne(filter);
  }

  async createBooking(data: CreateBookingData) {
    return this.bookingModel.create(data);
  }

  async updateBooking({ id, customerId, ...data }: UpdateBookingData) {
    const filter = { _id: id, customerId, status: { $in: [BookingStatusType.PENDING, BookingStatusType.ACCEPTED] } };
    const update = { $set: data };
    const options = { new: true };

    return this.bookingModel.findOneAndUpdate(filter, update, options);
  }

  async acceptBooking(data: AcceptBookingData) {
    const filter = { _id: data.id, serviceProviderId: data.serviceProviderId, status: BookingStatusType.PENDING };
    const update = { $set: { status: BookingStatusType.ACCEPTED } };
    const options = { new: true };

    return this.bookingModel.findOneAndUpdate(filter, update, options);
  }

  async cancelBooking(data: CancelBookingData) {
    const filter = {
      _id: data.id,
      $or: [{ customerId: data.userId }, { serviceProviderId: data.userId }],
      status: { $in: [BookingStatusType.PENDING, BookingStatusType.ACCEPTED] },
    };
    const update = { $set: { status: BookingStatusType.CANCELED, cancelledBy: data.userId } };
    const options = { new: true };

    return this.bookingModel.findOneAndUpdate(filter, update, options);
  }
}
