import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HasRole } from '../../common/decorators/has-role.decorator';
import { HasPermission } from '../../common/decorators/permission.decorator';
import { CurrentUser } from '../../common/directives/current-user.directive';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { PERMISSIONS } from '../common/types/permission.type';
import { PaginationArgs } from '../common/types/query.type';
import { UserType } from '../common/types/user.type';
import { CustomerNotFoundError } from './customer.error';
import { Customer } from './customer.schema';
import { CustomerService } from './customer.service';
import {
  CustomerFilterInput,
  CustomerPagination,
  CustomerPaginationInput,
  DisableCustomerInput,
  EnableCustomerInput,
} from './customer.type';

@Resolver(() => Customer)
export class CustomerResolver extends NodeResolver<Customer> {
  constructor(private readonly customerService: CustomerService) {
    super();
  }

  @Query(() => CustomerPagination)
  async customersPagination(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: CustomerPaginationInput = {},
  ) {
    return this.customerService.getPaginatedCustomers(paginationArgs, input);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CUSTOMER.READ)
  @Query(() => Customer, { nullable: true })
  async customer(@Args('input', { nullable: true }) input: CustomerFilterInput = {}) {
    return this.customerService.getCustomer(input);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CUSTOMER.READ)
  @Query(() => Int)
  async customersCount() {
    return this.customerService.getCustomersCount();
  }

  @HasRole(UserType.CUSTOMER)
  @Query(() => Customer)
  async customerProfile(@CurrentUser() currentUser: Customer) {
    return this.customerService.getCustomerById(currentUser._id);
  }

  @Mutation(() => Customer)
  async enableCustomer(@Args('input') input: EnableCustomerInput) {
    const customer = await this.customerService.enableCustomer(input.id);

    if (!customer) throw new CustomerNotFoundError('Customer not found');

    return customer;
  }

  @Mutation(() => Customer)
  async disableCustomer(@Args('input') input: DisableCustomerInput) {
    const customer = await this.customerService.disableCustomer(input.id);

    if (!customer) throw new CustomerNotFoundError('Customer not found');

    return customer;
  }
}
