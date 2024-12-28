import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '../common/schemas/base.schema';

export enum BookingHistoryStatusType {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  UPDATED = 'UPDATED',
  CANCELED = 'CANCELED',
}

@ObjectType()
@Schema({ collection: 'booking_histories' })
export class BookingHistory extends BaseSchema {
  @Prop({ required: true, ref: 'Booking', type: mongoose.Schema.Types.ObjectId })
  bookingId: Types.ObjectId;

  @Field(() => BookingHistoryStatusType)
  @Prop({ required: true, enum: BookingHistoryStatusType })
  status: BookingHistoryStatusType;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ required: true, type: Map, of: mongoose.Schema.Types.Mixed })
  metadata: Map<string, any>;
}

export type BookingHistorySchema = HydratedDocument<BookingHistory>;

export const BookingHistorySchema = SchemaFactory.createForClass(BookingHistory);
