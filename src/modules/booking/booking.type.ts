import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { DateFilterInput, EnumFilterInput, IDFilterInput } from '../common/types/filter.type';
import { createConnection, createInput } from '../common/types/query.type';
import { Booking, BookingStatusType } from './booking.schema';

registerEnumType(BookingStatusType, {
  name: 'BookingStatusType',
});

@InputType()
export class BookingStatusInput extends EnumFilterInput(BookingStatusType, 'BookingStatus') {}

@ObjectType()
export class BookingConnection extends createConnection(Booking) {}

@ObjectType()
export class BookingCountByCategory {
  @Field(() => ID)
  id: string;

  @Field()
  bookingCount: number;

  @Field({ nullable: true })
  icon?: string;
}

@InputType()
export class BookingFilterInput {
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
  @Type(() => DateFilterInput)
  @IsOptional()
  @Field(() => DateFilterInput, { nullable: true })
  dateTime?: DateFilterInput;

  @ValidateNested()
  @Type(() => BookingStatusInput)
  @IsOptional()
  @Field(() => BookingStatusInput, { nullable: true })
  status?: BookingStatusInput;

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
export class CreateBookingInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsDate()
  @Field()
  dateTime: Date;

  @IsMongoId()
  @Field()
  serviceProviderId: string;

  @IsMongoId()
  @Field()
  categoryId: string;

  @IsMongoId()
  @Field()
  customerAddressId?: string;
}

@InputType()
export class UpdateBookingInput {
  @IsMongoId()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsOptional()
  @Field()
  description: string;

  @IsDate()
  @Field()
  dateTime: Date;
}

@InputType()
export class AcceptBookingInput {
  @IsMongoId()
  @Field()
  id: string;
}

@InputType()
export class CancelBookingInput {
  @IsMongoId()
  @Field()
  id: string;
}

@InputType()
export class BookingConnectionInput extends createInput(BookingFilterInput) {}
