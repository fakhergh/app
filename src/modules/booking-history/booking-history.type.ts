import { Field, InputType, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { BookingHistory, BookingHistoryStatusType } from '@/modules/booking-history/booking-history.schema';
import { DateFilterInput, EnumFilterInput, IDFilterInput } from '@/modules/common/types/filter.type';
import { createConnection, createInput } from '@/modules/common/types/query.type';

registerEnumType(BookingHistoryStatusType, {
  name: 'BookingHistoryStatusType',
});

@ObjectType()
export class BookingHistoryConnection extends createConnection(BookingHistory) {}

@InputType()
export class BookingHistoryStatusInput extends EnumFilterInput<BookingHistoryStatusType>(
  BookingHistoryStatusType,
  'BookingHistoryStatus',
) {}

@InputType()
export class BookingHistoryFilterInput {
  @ValidateNested()
  @IsOptional()
  @Type(() => IDFilterInput)
  @Field({ nullable: true })
  id?: IDFilterInput;

  @ValidateNested()
  @IsOptional()
  @Type(() => IDFilterInput)
  @Field(() => IDFilterInput, { nullable: true })
  bookingId?: IDFilterInput;

  @ValidateNested()
  @IsOptional()
  @Type(() => BookingHistoryStatusInput)
  @Field(() => BookingHistoryStatusInput, { nullable: true })
  status?: BookingHistoryStatusInput;

  @ValidateNested()
  @IsOptional()
  @Type(() => DateFilterInput)
  @Field(() => DateFilterInput, { nullable: true })
  createdAt?: DateFilterInput;

  @ValidateNested()
  @IsOptional()
  @Type(() => DateFilterInput)
  @Field(() => DateFilterInput, { nullable: true })
  updatedAt?: DateFilterInput;
}

@InputType()
export class BookingHistoryConnectionInput extends createInput(BookingHistoryFilterInput) {}

@InputType()
export class NestedBookingHistoryInput extends OmitType(BookingHistoryConnectionInput, ['filter']) {}
