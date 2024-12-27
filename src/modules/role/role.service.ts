import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '@/common/utils/pagination.util';
import { FieldService, FieldType, FilterConfigOptions } from '@/modules/common/services/field.service';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { Role, RoleDocument } from '@/modules/role/role.schema';
import { CreateRoleInput, RolePaginationInput, UpdateRoleInput } from '@/modules/role/role.type';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  name: { type: FieldType.STRING },
  type: { type: FieldType.ENUM },
  active: { type: FieldType.BOOLEAN },
  permission: { type: FieldType.ID, overrideFieldName: 'permissions' },
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
};

@Injectable()
export class RoleService extends FieldService<Role> {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {
    super(filterConfigOptions);
  }

  async getRolesPagination(paginationArgs: PaginationArgs | null, input: RolePaginationInput) {
    const baseFilter: FilterQuery<RoleDocument> = { deleted: { $ne: true } };
    const filter = this.configureFilters(baseFilter, input.filter);
    const countFilter = { ...filter };

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const [itemsCount, items] = await Promise.all([
      this.roleModel.countDocuments(countFilter),
      this.roleModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }

  async getRolesByIds(ids?: Types.ObjectId[]) {
    const filter: FilterQuery<RoleDocument> = { deleted: { $ne: true } };

    if (Array.isArray(ids)) filter._id = { $in: ids };

    return this.roleModel.find(filter);
  }

  async checkRoleExistenceByName(name: string) {
    const filter = { name, deleted: { $ne: true } };

    return this.roleModel.exists(filter);
  }

  async createRole(data: CreateRoleInput) {
    return this.roleModel.create(data);
  }

  async updateRole({ id, ...data }: UpdateRoleInput) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: data };
    const options = { new: true };

    return this.roleModel.findOneAndUpdate(filter, update, options);
  }

  async deleteRole(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };

    return this.roleModel.findOneAndUpdate(filter, update, options);
  }

  async enableRole(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: true } };
    const options = { new: true };

    return this.roleModel.findOneAndUpdate(filter, update, options);
  }

  async disableRole(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: false } };
    const options = { new: true };

    return this.roleModel.findOneAndUpdate(filter, update, options);
  }
}
