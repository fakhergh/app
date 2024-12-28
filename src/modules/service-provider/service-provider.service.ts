import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { get } from 'lodash';
import { FilterQuery, Model, PipelineStage, SortOrder } from 'mongoose';

import { PaginationFactory } from '../../common/utils/pagination.util';
import { ServiceProviderSignUpInput } from '../auth/auth.type';
import { FieldService, FieldType, FilterConfigOptions } from '../common/services/field.service';
import { ConnectionArgs, PaginationArgs } from '../common/types/query.type';
import { ServiceProvider } from './service-provider.schema';
import { ServiceProviderConnectionInput, ServiceProviderFilterInput } from './service-provider.type';

const filterConfigOptions: FilterConfigOptions = {
  id: { type: FieldType.ID, overrideFieldName: '_id' },
  categoryId: { type: FieldType.ID, overrideFieldName: 'profileDetail.categoryIds' },
  email: { type: FieldType.STRING },
  name: { type: FieldType.STRING },
  active: { type: FieldType.BOOLEAN },
  /*location: {
    type: FieldType.LOCATION,
    overrideFieldName: 'profileDetail.location',
    locationType: 'Point',
    maxDistance: 50_000,
  },*/
  createdAt: { type: FieldType.DATE },
  updatedAt: { type: FieldType.DATE },
  deleted: { type: FieldType.BOOLEAN },
};

@Injectable()
export class ServiceProviderService extends FieldService<ServiceProvider> {
  constructor(@InjectModel(ServiceProvider.name) private readonly serviceProviderModel: Model<ServiceProvider>) {
    super(filterConfigOptions);
  }

  async getServiceProvidersCount(input: ServiceProviderFilterInput) {
    const filter: FilterQuery<ServiceProvider> = {
      deleted: { $ne: true },
    };

    this.configureFilters(filter, input);

    return this.serviceProviderModel.countDocuments(filter);
  }

  async getServiceProvider(filterInput: ServiceProviderFilterInput) {
    const filter: FilterQuery<ServiceProvider> = this.configureFilters(
      {},
      {
        ...filterInput,
        deleted: { ne: true },
      },
    );

    return this.serviceProviderModel.findOne(filter);
  }

  async getServiceProviderByEmail(email: string) {
    const filter: FilterQuery<ServiceProvider> = { email, deleted: { $ne: true } };

    return this.serviceProviderModel.findOne(filter);
  }

  async getPaginatedServiceProviders(connectionArgs: ConnectionArgs | null, input: ServiceProviderConnectionInput) {
    const baseFilter = { deleted: { $ne: true } };
    const filter = this.configureFilters(baseFilter, input.filter);
    const countFilter = { ...filter };

    if (connectionArgs.after) {
      filter._id = { $lt: connectionArgs.after };
    }

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.serviceProviderModel.countDocuments(countFilter),
      this.serviceProviderModel.find(filter).limit(connectionArgs.first).sort(sortOptions),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount, connectionArgs.first, (item) =>
      item._id.toString(),
    );
  }

  async getServiceProvidersPagination(paginationArgs: PaginationArgs | null, input: ServiceProviderConnectionInput) {
    const baseFilter = { deleted: { $ne: true } };
    const filter = this.configureFilters(baseFilter, input.filter);
    const countFilter = { ...filter };

    const offset = PaginationFactory.getOffset(paginationArgs.page, paginationArgs.limit);

    const sortOptions: { [key: string]: SortOrder } = { _id: 'desc' };

    const [itemsCount, items] = await Promise.all([
      this.serviceProviderModel.countDocuments(countFilter),
      this.serviceProviderModel.find(filter).skip(offset).limit(paginationArgs.limit).sort(sortOptions),
    ]);

    return PaginationFactory.createOffsetBasedPage(
      items,
      itemsCount,
      paginationArgs.page,
      paginationArgs.limit,
      offset,
    );
  }

  async getPaginatedServiceProvidersByLocation(
    connectionArgs: ConnectionArgs | null,
    input: ServiceProviderConnectionInput,
  ) {
    const filter = { deleted: { $ne: true } };
    this.configureFilters(filter, input.filter);
    const countFilter = { ...filter };

    //todo::: think about this cursor

    const cursorField = 'reviewInformation.rate';

    if (connectionArgs.after) {
      filter[cursorField] = { $lt: parseInt(connectionArgs.after, 10) };
    }

    const basePipeline: Array<PipelineStage> = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [input.filter.location.near.longitude, input.filter.location.near.latitude],
          },
          distanceField: 'distance',
          maxDistance: 50_000, // 50km
          spherical: true,
        },
      },
    ];

    const countPipeline = [...basePipeline];
    countPipeline.push({ $match: countFilter });
    countPipeline.push({ $project: { _id: 1 } });

    basePipeline.push({ $match: filter });
    basePipeline.push({ $limit: connectionArgs.first });

    const [itemsCount, items] = await Promise.all([
      this.serviceProviderModel.aggregate(countPipeline),
      this.serviceProviderModel.aggregate(basePipeline),
    ]);

    return PaginationFactory.createCursorBasedPage(items, itemsCount.length, connectionArgs.first, (item) =>
      get(item, cursorField),
    );
  }

  async createServiceProvider(data: ServiceProviderSignUpInput) {
    return this.serviceProviderModel.create(data);
  }

  async enableServiceProvider(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: true } };
    const options = { new: true };
    return this.serviceProviderModel.findOneAndUpdate(filter, update, options);
  }

  async disableServiceProvider(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { active: false } };
    const options = { new: true };
    return this.serviceProviderModel.findOneAndUpdate(filter, update, options);
  }

  async deleteServiceProvider(id: string) {
    const filter = { _id: id, deleted: { $ne: true } };
    const update = { $set: { deleted: true } };
    const options = { new: true };
    return this.serviceProviderModel.findOneAndUpdate(filter, update, options);
  }
}
