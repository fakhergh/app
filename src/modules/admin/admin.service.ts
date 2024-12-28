import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { AdminPaginationInput, CreateAdminInput, UpdateAdminInput, UpdateAdminProfileInput } from '../admin/admin.type';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { PaginationArgs } from '../common/types/query.type';
import { Admin } from './admin.schema';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  email: { type: FieldType.STRING },
  name: { type: FieldType.STRING },
  role: { type: FieldType.ID, overrideFieldName: 'roles' },
  active: { type: FieldType.BOOLEAN },
  updatedAt: { type: FieldType.DATE },
  createdAt: { type: FieldType.DATE },
};

@Injectable()
export class AdminService extends FieldService<Admin> {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<Admin>) {
    super(filterConfigOptions);
  }

  checkExistenceByEmail(email: string) {
    const filter = { deleted: { $ne: true }, email };
    return this.adminModel.exists(filter);
  }

  async getAdminsPagination(paginationArgs: PaginationArgs | null, input: AdminPaginationInput) {
    const filter: FilterQuery<Admin> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.adminModel.countDocuments(countFilter),
      this.adminModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }

  getAdminById(id: Types.ObjectId | string) {
    const filter = { _id: id, deleted: { $ne: true } };
    return this.adminModel.findOne(filter);
  }

  getAdminByEmail(email: string) {
    const filter = { email, deleted: { $ne: true } };
    return this.adminModel.findOne(filter);
  }

  createAdmin(data: CreateAdminInput, resetPasswordToken: string, resetPasswordExpiresAt: Date) {
    return this.adminModel.create({
      ...data,
      resetPasswordToken,
      resetPasswordExpiresAt,
    });
  }

  updateAdmin({ id, ...data }: UpdateAdminInput) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: data };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  async deleteAdmin(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  async enableAdmin(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: true } };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  async disableAdmin(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: false } };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  async updateAdminResetToken(id: Types.ObjectId, resetPasswordToken: string, resetPasswordExpiresAt: Date) {
    const filter = { _id: id };
    const update = { $set: { resetPasswordToken, resetPasswordExpiresAt } };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  generateAdminResetPasswordLink(email: string, token: string) {
    return `${process.env.ADMIN_RESET_PASSWORD_URL}?email=${email}&token=${token}`;
  }

  changePassword(id: Types.ObjectId, hash: string) {
    const filter = { _id: id };
    const update = {
      password: hash,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  setTwoFactorSecret(id: Types.ObjectId | string, secret: string, iv: string) {
    const filter = { _id: id };
    const update = {
      $set: { twoFactor: { secret, iv } },
    };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  enableTwoFactor(id: Types.ObjectId | string) {
    const filter = { _id: id };
    const update = {
      $set: { 'twoFactor.enabled': true },
    };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  disableTwoFactor(id: Types.ObjectId | string) {
    const filter = { _id: id };
    const update = {
      $set: { twoFactor: null },
    };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }

  updateAdminProfile(id: Types.ObjectId | string, input: UpdateAdminProfileInput) {
    const filter = { _id: id };
    const update = { $set: { name: input.name } };
    const options = { new: true };

    return this.adminModel.findOneAndUpdate(filter, update, options);
  }
}
