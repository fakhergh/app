import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@ObjectType()
@Schema({ collection: 'feedbacks', timestamps: true })
export class Feedback {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  customer?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  serviceProvider?: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type FeedbackDocument = HydratedDocument<Feedback>;

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
