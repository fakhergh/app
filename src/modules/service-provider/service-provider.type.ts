import { Field, ID as Id, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { IDFilterInput, LocationFilterInput } from '../common/types/filter.type';
import { createConnection, createInput, createPagination } from '../common/types/query.type';
import { ServiceProvider } from './service-provider.schema';

@ObjectType()
export class ServiceProviderConnection extends createConnection(ServiceProvider) {}

@ObjectType()
export class ServiceProviderPagination extends createPagination(ServiceProvider) {}

@InputType()
export class ServiceProviderFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  categoryId?: IDFilterInput;

  @ValidateNested()
  @Type(() => LocationFilterInput)
  @IsOptional()
  @Field(() => LocationFilterInput, { nullable: true })
  location?: LocationFilterInput;
}

@InputType()
export class EnableServiceProviderInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class DisableServiceProviderInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class DeleteServiceProviderInput {
  @IsMongoId()
  @Field(() => Id)
  id: string;
}

@InputType()
export class ServiceProviderConnectionInput extends createInput(ServiceProviderFilterInput) {}

@InputType()
export class ServiceProviderPaginationInput extends createInput(ServiceProviderFilterInput) {}
