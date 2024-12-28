import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { IDFilterInput } from '../common/types/filter.type';
import { createConnection, createInput } from '../common/types/query.type';
import { Message, MessageType } from './message.schema';

registerEnumType(MessageType, { name: 'MessageType' });

@InputType()
export class MessageFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  conversationId?: IDFilterInput;
}

@InputType()
export class MessageConnectionInput extends createInput(MessageFilterInput) {}

@ObjectType()
export class MessageConnection extends createConnection(Message) {}
