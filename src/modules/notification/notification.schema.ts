import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import mongoose, { Types } from 'mongoose';

export enum NotificationAction {
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  BOOKING_RESCHEDULED = 'BOOKING_RESCHEDULED',
  BOOKING_CANCELED = 'BOOKING_CANCELED',
}

@ObjectType()
@Schema()
export class Notification {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  recipientId: Types.ObjectId;

  @Field(() => NotificationAction)
  @Prop({ enum: NotificationAction, required: true })
  action: NotificationAction;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ required: true, type: Map, of: mongoose.Schema.Types.ObjectId })
  metadata: Map<string, any>;

  @Prop({ default: false })
  deleted: boolean;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
