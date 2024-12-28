import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { PaginationArgs } from '../common/types/query.type';
import { Permission, PermissionAction, PermissionDocument, PermissionType } from './permission.schema';
import { CreatePermissionInput, PermissionPaginationInput, UpdatePermissionInput } from './permission.type';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  name: { type: FieldType.STRING },
  action: { type: FieldType.ENUM },
  type: { type: FieldType.ENUM },
  active: { type: FieldType.BOOLEAN },
  updatedAt: { type: FieldType.DATE },
  createdAt: { type: FieldType.DATE },
};

@Injectable()
export class PermissionService extends FieldService<Permission> {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {
    super(filterConfigOptions);
  }

  async checkPermissionExistenceById(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };

    return this.permissionModel.exists(filter);
  }

  async getPermissionsPagination(paginationArgs: PaginationArgs | null, input: PermissionPaginationInput) {
    const filter: FilterQuery<PermissionDocument> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.permissionModel.countDocuments(countFilter),
      this.permissionModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }

  async getPermissionsByIds(ids?: Array<Types.ObjectId>) {
    const filter: FilterQuery<PermissionDocument> = { deleted: { $ne: true } };

    if (Array.isArray(ids)) filter._id = { $in: ids };

    return this.permissionModel.find(filter);
  }

  async checkPermissionExistenceByActionAndType(action: PermissionAction, type: PermissionType) {
    const filter = { action, type, deleted: { $ne: true } };

    return this.permissionModel.exists(filter);
  }

  async createPermission(data: CreatePermissionInput) {
    return this.permissionModel.create(data);
  }

  async updatePermission({ id, ...data }: UpdatePermissionInput) {
    const filter = { _id: id };
    const update = { $set: data };
    const options = { new: true };

    return this.permissionModel.findOneAndUpdate(filter, update, options);
  }

  async deletePermission(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };

    return this.permissionModel.findOneAndUpdate(filter, update, options);
  }

  async enablePermission(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: true } };
    const options = { new: true };

    return this.permissionModel.findOneAndUpdate(filter, update, options);
  }

  async disablePermission(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: false } };
    const options = { new: true };

    return this.permissionModel.findOneAndUpdate(filter, update, options);
  }
}
