import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ID as Id } from '@nestjs/graphql/dist/scalars';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { IDFilterInput } from '@/modules/common/types/filter.type';
import { createConnection, createInput } from '@/modules/common/types/query.type';
import { CustomerAddress } from '@/modules/customer-address/customer-address.schema';

@ObjectType()
export class CustomerAddressConnection extends createConnection(CustomerAddress) {}

@InputType()
export class CreateCustomerAddressInput {
  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  address: string;

  @Field()
  addressDetails: string;

  @Field()
  phoneNumber: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@InputType()
export class SetDefaultCustomerAddressInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class UpdateCustomerAddressInput extends CreateCustomerAddressInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class DeleteCustomerAddressInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class CustomerAddressFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  customerId?: IDFilterInput;
}

@InputType()
export class CustomerAddressConnectionInput extends createInput(CustomerAddressFilterInput) {}
