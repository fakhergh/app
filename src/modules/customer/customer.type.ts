import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { BooleanFilterInput, DateFilterInput, IDFilterInput, StringFilterInput } from '../common/types/filter.type';
import { createInput, createPagination } from '../common/types/query.type';
import { Customer } from '../customer/customer.schema';

@ObjectType()
export class CustomerPagination extends createPagination(Customer) {}

@InputType()
export class CustomerFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @IsEmail()
  @Field(() => StringFilterInput, { nullable: true })
  email?: StringFilterInput;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  active?: BooleanFilterInput;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  verified?: BooleanFilterInput;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  createdAt?: DateFilterInput;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  updatedAt?: DateFilterInput;
}

@InputType()
export class CustomerPaginationInput extends createInput(CustomerFilterInput) {}

@InputType()
export class EnableCustomerInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}

@InputType()
export class DisableCustomerInput {
  @IsMongoId()
  @Field(() => ID)
  id: string;
}
