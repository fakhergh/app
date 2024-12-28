import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { AuthProvider } from '../common/types/auth.type';
import { PaginationArgs } from '../common/types/query.type';
import { Customer } from './customer.schema';
import { CustomerFilterInput, CustomerPaginationInput } from './customer.type';

export class CreateCustomerData {
  initialName: string;
  name: string;
  email: string;
  password?: string;
  authProvider: AuthProvider;
  verifyAccountToken?: string;
}

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  name: { type: FieldType.STRING },
  email: { type: FieldType.STRING },
  active: { type: FieldType.BOOLEAN },
  verified: { type: FieldType.BOOLEAN },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
};

@Injectable()
export class CustomerService extends FieldService<Customer> {
  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<Customer>) {
    super(filterConfigOptions);
  }

  async getPaginatedCustomers(paginationArgs: PaginationArgs | null, input: CustomerPaginationInput) {
    const filter: FilterQuery<Customer> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.customerModel.countDocuments(countFilter),
      this.customerModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }

  async getCustomer(input: CustomerFilterInput) {
    const baseFilter = { deleted: { $ne: true } };
    const filter = this.configureFilters(baseFilter, input);

    return this.customerModel.findOne(filter);
  }

  getCustomerById(id: string | Types.ObjectId) {
    const filter = { _id: id, deleted: { $ne: true } };

    return this.customerModel.findOne(filter);
  }

  async getCustomerByEmail(email: string) {
    const filter = { email };

    return this.customerModel.findOne(filter).sort('-createdAt');
  }

  async getCustomersCount() {
    const filter = { deleted: { $ne: true } };

    return this.customerModel.countDocuments(filter);
  }

  async createCustomer(data: CreateCustomerData) {
    const verified = data.authProvider !== AuthProvider.DEFAULT;
    return this.customerModel.create({ ...data, verified });
  }

  async verifyCustomer(email: string) {
    const filter = { email, verified: { $ne: true } };
    const update = { $set: { verified: true, verifyAccountToken: null } };
    const options = { new: true };
    return this.customerModel.findOneAndUpdate(filter, update, options);
  }

  async updateForgotPasswordToken(id: Types.ObjectId | string, token: string | null, tokenExpiresAt: Date | null) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = {
      $set: {
        forgotPasswordToken: token,
        forgotPasswordExpiresAt: tokenExpiresAt,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    };
    const options = { new: true };
    return this.customerModel.findOneAndUpdate(filter, update, options);
  }

  async updateResetPasswordToken(id: Types.ObjectId | string, token: string | null, tokenExpiresAt: Date | null) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: tokenExpiresAt,
      },
    };
    const options = { new: true };
    return this.customerModel.findOneAndUpdate(filter, update, options);
  }

  async updatePassword(id: Types.ObjectId | string, password: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { password } };
    const options = { new: true };

    return this.customerModel.findOneAndUpdate(filter, update, options);
  }

  async enableCustomer(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: true } };
    const options = { new: true };

    return this.customerModel.findOneAndUpdate(filter, update, options);
  }

  async disableCustomer(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: false } };
    const options = { new: true };

    return this.customerModel.findOneAndUpdate(filter, update, options);
  }
}
