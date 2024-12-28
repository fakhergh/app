import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { RequestUser } from '@/modules/common/types/auth.type';
import { ConnectionArgs } from '@/modules/common/types/query.type';
import { UserType } from '@/modules/common/types/user.type';
import { CustomerAddressNotFoundError } from '@/modules/customer-address/customer-address.error';
import { CustomerAddress } from '@/modules/customer-address/customer-address.schema';
import { CustomerAddressService } from '@/modules/customer-address/customer-address.service';
import {
  CreateCustomerAddressInput,
  CustomerAddressConnection,
  CustomerAddressConnectionInput,
  DeleteCustomerAddressInput,
  SetDefaultCustomerAddressInput,
  UpdateCustomerAddressInput,
} from '@/modules/customer-address/customer-address.type';

@Resolver(() => CustomerAddress)
export class CustomerAddressResolver extends NodeResolver<CustomerAddress> {
  constructor(@Inject() private customerAddressService: CustomerAddressService) {
    super();
  }

  @HasRole(UserType.CUSTOMER)
  @Query(() => CustomerAddressConnection)
  async customerAddressesConnection(
    @CurrentUser() currentUser: RequestUser,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: CustomerAddressConnectionInput = {},
  ) {
    return this.customerAddressService.getCustomerAddressesCursorPagination(connectionArgs, {
      filter: { ...input.filter, customerId: { eq: currentUser._id.toString() } },
    });
  }

  @HasRole(UserType.CUSTOMER)
  @Query(() => CustomerAddress, { nullable: true })
  async defaultCustomerAddress(@CurrentUser() currentUser: RequestUser) {
    return this.customerAddressService.getDefaultCustomerAddressByCustomerId(currentUser._id);
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => CustomerAddress)
  async createCustomerAddress(
    @CurrentUser() currentUser: RequestUser,
    @Args('input') input: CreateCustomerAddressInput,
  ) {
    const checkDefaultAddressExistence = await this.customerAddressService.checkDefaultCustomerAddressByCustomerId(
      currentUser._id,
    );

    return this.customerAddressService.createCustomerAddress({
      customerId: currentUser._id,
      location: { address: input.address, coordinates: [input.longitude, input.latitude] },
      addressDetails: input.addressDetails,
      city: input.city,
      country: input.country,
      phoneNumber: input.phoneNumber,
      firstName: input.firstName,
      lastName: input.lastName,
      default: !checkDefaultAddressExistence,
    });
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => CustomerAddress)
  async updateCustomerAddress(
    @CurrentUser() currentUser: RequestUser,
    @Args('input') input: UpdateCustomerAddressInput,
  ) {
    const customerAddress = await this.customerAddressService.updateCustomerAddress(input.id, currentUser._id, {
      location: { address: input.address, coordinates: [input.longitude, input.latitude] },
      addressDetails: input.addressDetails,
      city: input.city,
      country: input.country,
      phoneNumber: input.phoneNumber,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    if (!customerAddress) throw new CustomerAddressNotFoundError('address not found');

    return customerAddress;
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => CustomerAddress)
  async setDefaultCustomerAddress(
    @CurrentUser() currentUser: RequestUser,
    @Args('input') input: SetDefaultCustomerAddressInput,
  ) {
    const defaultAddress = await this.customerAddressService.getDefaultCustomerAddressByCustomerId(currentUser._id);

    if (defaultAddress) {
      await this.customerAddressService.updateCustomerAddress(defaultAddress._id, currentUser._id, {
        default: false,
      });
    }

    const newDefaultAddress = await this.customerAddressService.updateCustomerAddress(input.id, currentUser._id, {
      default: true,
    });

    if (!newDefaultAddress) throw new CustomerAddressNotFoundError('address not found');

    return newDefaultAddress;
  }

  @HasRole(UserType.CUSTOMER)
  @Mutation(() => CustomerAddress)
  async deleteCustomerAddress(
    @CurrentUser() currentUser: RequestUser,
    @Args('input') input: DeleteCustomerAddressInput,
  ) {
    const customerAddress = await this.customerAddressService.deleteCustomerAddress(input.id, currentUser._id);

    if (!customerAddress) throw new CustomerAddressNotFoundError('address not found');

    return customerAddress;
  }
}
