import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '../common/schemas/base.schema';

export enum BookingStatusType {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@ObjectType()
@Schema({ collection: 'bookings', timestamps: true })
export class Booking extends BaseSchema {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' })
  serviceProviderId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'CustomerAddress' })
  customerAddressId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field()
  @Prop({ required: true })
  dateTime: Date;

  @Field(() => BookingStatusType)
  @Prop({
    enum: BookingStatusType,
    default: BookingStatusType.PENDING,
  })
  status: BookingStatusType;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  cancelledBy?: Types.ObjectId;
}

export type BookingDocument = HydratedDocument<Booking>;

export const BookingSchema = SchemaFactory.createForClass(Booking);
