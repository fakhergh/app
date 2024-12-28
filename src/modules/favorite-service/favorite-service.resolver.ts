import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';

import { HasRole } from '../../common/decorators/has-role.decorator';
import { CurrentUser } from '../../common/directives/current-user.directive';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { RequestUser } from '../common/types/auth.type';
import { ConnectionArgs } from '../common/types/query.type';
import { UserType } from '../common/types/user.type';
import { ServiceProvider } from '../service-provider/service-provider.schema';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { ServiceProviderFilterInput } from '../service-provider/service-provider.type';
import { FavoriteServiceDuplicationError, FavoriteServiceNotFoundError } from './favorite-service.error';
import { FavoriteService } from './favorite-service.schema';
import {
  CreateFavoriteServiceData,
  DeleteFavoriteServiceData,
  FavoriteServiceService,
} from './favorite-service.service';
import {
  CreateFavoriteServiceInput,
  DeleteFavoriteServiceInput,
  FavoriteServiceConnection,
  FavoriteServiceConnectionInput,
} from './favorite-service.type';

@Resolver(() => FavoriteService)
export class FavoriteServiceResolver extends NodeResolver<FavoriteService> {
  constructor(
    private readonly favoriteServiceService: FavoriteServiceService,
    private readonly serviceProviderService: ServiceProviderService,
  ) {
    super();
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => FavoriteService)
  async addFavoriteService(@CurrentUser() currentUser: RequestUser, @Args('input') input: CreateFavoriteServiceInput) {
    const favoriteServiceExists = await this.favoriteServiceService.checkFavoriteExistenceByServiceProviderAndCustomer(
      input.serviceProviderId,
      currentUser._id,
    );

    if (favoriteServiceExists) throw new FavoriteServiceDuplicationError('Favorite already exists');

    const data: CreateFavoriteServiceData = { ...input, customerId: currentUser._id };

    return this.favoriteServiceService.createFavoriteService(data);
  }

  @HasRole(UserType.CUSTOMER)
  @Query(() => FavoriteServiceConnection)
  async favoriteServicesConnection(
    @CurrentUser() currentUser: RequestUser,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: FavoriteServiceConnectionInput = {},
  ) {
    const options = { ...input, filter: input.filter ?? {} };
    options.filter.id = { eq: currentUser._id.toString() };

    return this.favoriteServiceService.getPaginatedFavoriteServices(connectionArgs, options);
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => FavoriteService)
  async deleteFavoriteService(
    @CurrentUser() currentUser: RequestUser,
    @Args('input') input: DeleteFavoriteServiceInput,
  ) {
    const filter: DeleteFavoriteServiceData = { ...input, customerId: currentUser._id };

    const favoriteService = await this.favoriteServiceService.removeFavoriteService(filter);

    if (!favoriteService) throw new FavoriteServiceNotFoundError('Favorite not found');

    return favoriteService;
  }

  @ResolveField(() => ServiceProvider)
  async serviceProvider(@Root() favoriteService: FavoriteService) {
    const filterInput: ServiceProviderFilterInput = { id: { eq: favoriteService.serviceProviderId.toString() } };

    return this.serviceProviderService.getServiceProvider(filterInput);
  }
}
