import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { BooleanFilterInput, IDFilterInput } from '../common/types/filter.type';
import { createConnection, createInput } from '../common/types/query.type';
import { Conversation } from './conversation.schema';

@InputType()
export class CreateConversationInput {
  @Field()
  serviceProviderId: string;
}

@ObjectType()
export class ConversationConnection extends createConnection(Conversation) {}

@InputType()
export class ConversationFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id?: IDFilterInput;

  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  customerId?: IDFilterInput;

  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  serviceProviderId?: IDFilterInput;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  archived?: BooleanFilterInput;

  bookingId?: IDFilterInput;
}

@InputType()
export class ConversationConnectionInput extends createInput(ConversationFilterInput) {}
