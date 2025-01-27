import { Field, ID as Id, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { IDFilterInput } from '../common/types/filter.type';
import { createConnection, createInput } from '../common/types/query.type';
import { CustomerAddress } from './customer-address.schema';

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
