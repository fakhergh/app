import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { RequestUser } from '@/modules/common/types/auth.type';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { ConnectionArgs, PaginationArgs } from '@/modules/common/types/query.type';
import { UserType } from '@/modules/common/types/user.type';
import { ServiceProviderNotFoundError } from '@/modules/service-provider/service-provider.error';
import { ServiceProvider } from '@/modules/service-provider/service-provider.schema';
import { ServiceProviderService } from '@/modules/service-provider/service-provider.service';
import {
  DeleteServiceProviderInput,
  EnableServiceProviderInput,
  ServiceProviderConnection,
  ServiceProviderConnectionInput,
  ServiceProviderFilterInput,
  ServiceProviderPagination,
  ServiceProviderPaginationInput,
} from '@/modules/service-provider/service-provider.type';

@Resolver(() => ServiceProvider)
export class ServiceProviderResolver extends NodeResolver<ServiceProvider> {
  constructor(private readonly serviceProviderService: ServiceProviderService) {
    super();
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.READ)
  @Query(() => Int)
  async serviceProvidersCount(@Args('input', { nullable: true }) input: ServiceProviderFilterInput = {}) {
    return this.serviceProviderService.getServiceProvidersCount(input);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.READ)
  @Query(() => ServiceProviderPagination)
  async serviceProvidersPagination(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: ServiceProviderPaginationInput = {},
  ) {
    return this.serviceProviderService.getServiceProvidersPagination(paginationArgs, input);
  }

  @HasRole(UserType.CUSTOMER)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.READ)
  @Query(() => ServiceProviderConnection)
  async serviceProvidersConnection(
    @CurrentUser() user: RequestUser,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: ServiceProviderConnectionInput = {},
  ) {
    if (user.userType === UserType.SERVICE_PROVIDER) {
      return this.serviceProviderService.getPaginatedServiceProvidersByLocation(connectionArgs, input);
    }

    return this.serviceProviderService.getPaginatedServiceProviders(connectionArgs, input);
  }

  @HasRole(UserType.ADMIN, UserType.CUSTOMER)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.READ)
  @Query(() => ServiceProvider, { nullable: true })
  async serviceProvider(@Args('input', { nullable: true }) input: ServiceProviderFilterInput = {}) {
    return this.serviceProviderService.getServiceProvider(input);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.UPDATE)
  @Mutation(() => ServiceProvider)
  async enableServiceProvider(@Args('input') input: EnableServiceProviderInput) {
    const serviceProvider = await this.serviceProviderService.enableServiceProvider(input.id);

    if (!serviceProvider) throw new ServiceProviderNotFoundError('Service provider not exists');

    return serviceProvider;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.UPDATE)
  @Mutation(() => ServiceProvider)
  async disableServiceProvider(@Args('input') input: EnableServiceProviderInput) {
    const serviceProvider = await this.serviceProviderService.disableServiceProvider(input.id);

    if (!serviceProvider) throw new ServiceProviderNotFoundError('Service provider not exists');

    return serviceProvider;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.SERVICE_PROVIDER.DELETE)
  @Mutation(() => ServiceProvider)
  async deleteServiceProvider(@Args('input') input: DeleteServiceProviderInput) {
    const serviceProvider = await this.serviceProviderService.deleteServiceProvider(input.id);

    if (!serviceProvider) throw new ServiceProviderNotFoundError('Service provider not exists');

    return serviceProvider;
  }
}
