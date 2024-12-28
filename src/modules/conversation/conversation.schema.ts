import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '../common/schemas/base.schema';

@ObjectType()
@Schema({ collection: 'conversations', timestamps: true })
export class Conversation extends BaseSchema {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' })
  serviceProviderId: Types.ObjectId;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' })
  bookingId?: Types.ObjectId | null;

  @Field({ defaultValue: false })
  @Prop({ default: false })
  archived: boolean;
}

export type ConversationDocument = HydratedDocument<Conversation>;

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
