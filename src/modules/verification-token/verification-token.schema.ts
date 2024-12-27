import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { UserType } from '@/modules/common/types/user.type';

@ObjectType()
@Schema({ collection: 'verification-tokens', timestamps: true })
export class VerificationToken {
  _id: Types.ObjectId;

  @Field()
  id: string;

  @Field()
  @Prop({ required: true })
  token: string;

  @Field(() => ID)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: Types.ObjectId;

  @Field(() => UserType)
  @Prop({ required: true })
  userType: UserType;

  @Field()
  @Prop({ default: false })
  verified: boolean;

  @Field()
  @Prop({ required: true })
  expiresIn: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type VerificationTokenDocument = HydratedDocument<VerificationToken>;

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);
