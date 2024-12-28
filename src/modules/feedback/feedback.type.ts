import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { BooleanFilterInput, DateFilterInput, IDFilterInput, StringFilterInput } from '../common/types/filter.type';
import { createInput, createPagination } from '../common/types/query.type';
import { Feedback } from '../feedback/feedback.schema';

@ObjectType()
export class FeedbackPagination extends createPagination(Feedback) {}

@InputType()
export class FeedbackFilterInput {
  @ValidateNested()
  @Type(() => IDFilterInput)
  @IsOptional()
  @Field(() => IDFilterInput, { nullable: true })
  id: IDFilterInput;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  customer: string;

  @ValidateNested()
  @Type(() => StringFilterInput)
  @IsOptional()
  @Field(() => StringFilterInput, { nullable: true })
  serviceProvider: string;

  @ValidateNested()
  @Type(() => BooleanFilterInput)
  @IsOptional()
  @Field(() => BooleanFilterInput, { nullable: true })
  pinned: boolean;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  createdAt: Date;

  @ValidateNested()
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  updatedAt: Date;
}

@InputType()
export class CreateFeedbackInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;
}

@InputType()
export class DeleteFeedbackInput {
  @IsMongoId()
  @Field()
  id: string;
}

@InputType()
export class PinFeedbackInput {
  @IsMongoId()
  @Field()
  id: string;
}

@InputType()
export class UnPinFeedbackInput {
  @IsMongoId()
  @Field()
  id: string;
}

@InputType()
export class FeedbackPaginationInput extends createInput(FeedbackFilterInput) {}
