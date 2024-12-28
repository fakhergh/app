import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

import { IDFilterInput } from '../common/types/filter.type';
import { createConnection, createInput } from '../common/types/query.type';
import { FavoriteService } from './favorite-service.schema';

@InputType()
export class CreateFavoriteServiceInput {
  @Field(() => ID)
  serviceProviderId: string;
}

@InputType()
export class DeleteFavoriteServiceInput {
  @Field(() => ID)
  serviceProviderId: string;
}

@ObjectType()
export class FavoriteServiceConnection extends createConnection(FavoriteService) {}

@InputType()
export class FavoriteServiceInputFilter {
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  customerId?: IDFilterInput;
}

@InputType()
export class FavoriteServiceConnectionInput extends createInput(FavoriteServiceInputFilter) {}
