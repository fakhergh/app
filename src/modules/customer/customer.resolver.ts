import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { UserType } from '@/modules/common/types/user.type';
import { CustomerNotFoundError } from '@/modules/customer/customer.error';
import { Customer } from '@/modules/customer/customer.schema';
import { CustomerService } from '@/modules/customer/customer.service';
import {
  CustomerFilterInput,
  CustomerPagination,
  CustomerPaginationInput,
  DisableCustomerInput,
  EnableCustomerInput,
} from '@/modules/customer/customer.type';

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
