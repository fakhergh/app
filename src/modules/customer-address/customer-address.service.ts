import { Injectable } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { CustomerAddressConnectionInput, CustomerAddressFilterInput } from '../customer-address/customer-address.type';
import { CustomerAddress } from './customer-address.schema';

export class CreateCustomerAddressData {
  customerId: Types.ObjectId;
  location: {
    address: string;
    coordinates: [number, number];
  };
  addressDetails: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  default: boolean;
}

export class UpdateCustomerAddressData extends PartialType(
  OmitType(CreateCustomerAddressData, ['customerId'] as const),
) {}

@Injectable()
export class CustomerAddressService extends FieldService<CustomerAddress> {
  constructor(@InjectModel(CustomerAddress.name) private readonly customerAddressModel: Model<CustomerAddress>) {
    super({
      deleted: { type: FieldType.BOOLEAN },
    });
  }

  async getCustomerAddress(filterInput: CustomerAddressFilterInput) {
    const filter: FilterQuery<CustomerAddress> = this.configureFilters(
      {},
      {
        ...filterInput,
        deleted: { ne: true },
      },
    );

    return this.customerAddressModel.findOne(filter);
  }

  async getCustomerAddressesCursorPagination(
    connectionArgs: ConnectionArgs | null,
    input: CustomerAddressConnectionInput,
  ) {
    const filter: FilterQuery<CustomerAddress> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { default: 'desc', createdAt: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.customerAddressModel.countDocuments(countFilter),
      this.customerAddressModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage<CustomerAddress>(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  async getDefaultCustomerAddressByCustomerId(customerId: Types.ObjectId | string) {
    const filter = { deleted: { $ne: true }, customerId, default: true };

    return this.customerAddressModel.findOne(filter);
  }

  async checkDefaultCustomerAddressByCustomerId(customerId: Types.ObjectId | string) {
    const filter = { deleted: { $ne: true }, customerId };

    return this.customerAddressModel.exists(filter);
  }

  async createCustomerAddress(data: CreateCustomerAddressData) {
    return this.customerAddressModel.create(data);
  }

  async updateCustomerAddress(
    id: Types.ObjectId | string,
    customerId: Types.ObjectId | string,
    data: Partial<UpdateCustomerAddressData>,
  ) {
    const filter = { _id: id, customerId, deleted: { $ne: true } };

    const update = { $set: data };
    const options = { new: true };

    return this.customerAddressModel.findOneAndUpdate(filter, update, options);
  }

  async deleteCustomerAddress(id: Types.ObjectId | string, customerId: Types.ObjectId | string) {
    const filter = { _id: id, customerId, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };
    return this.customerAddressModel.findOneAndUpdate(filter, update, options);
  }
}
