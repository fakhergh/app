import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { FieldService } from '../common/services/field.service';
import { ConnectionArgs } from '../common/types/query.type';
import { FavoriteService } from './favorite-service.schema';
import {
  CreateFavoriteServiceInput,
  DeleteFavoriteServiceInput,
  FavoriteServiceConnectionInput,
} from './favorite-service.type';

export interface CreateFavoriteServiceData extends CreateFavoriteServiceInput {
  customerId: Types.ObjectId;
}

export interface DeleteFavoriteServiceData extends DeleteFavoriteServiceInput {
  customerId: Types.ObjectId;
}

@Injectable()
export class FavoriteServiceService extends FieldService<FavoriteService> {
  constructor(@InjectModel(FavoriteService.name) private readonly favoriteServiceModel: Model<FavoriteService>) {
    super();
  }

  createFavoriteService(createFavoriteServiceInput: CreateFavoriteServiceData) {
    return this.favoriteServiceModel.create(createFavoriteServiceInput);
  }

  async getPaginatedFavoriteServices(
    connectionArgs: ConnectionArgs | null = {},
    input: FavoriteServiceConnectionInput,
  ) {
    const filter: FilterQuery<FavoriteService> = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { createdAt: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.favoriteServiceModel.countDocuments(countFilter),
      this.favoriteServiceModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage<FavoriteService>(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  removeFavoriteService(filter: DeleteFavoriteServiceData) {
    return this.favoriteServiceModel.findOneAndDelete(filter);
  }

  checkFavoriteExistenceByServiceProviderAndCustomer(
    serviceProviderId?: Types.ObjectId | string,
    customerId?: Types.ObjectId | string,
  ) {
    const filter: FilterQuery<FavoriteService> = {};

    if (serviceProviderId) filter.serviceProviderId = serviceProviderId;
    if (customerId) filter.customerId = customerId;

    return this.favoriteServiceModel.exists(filter);
  }
}
