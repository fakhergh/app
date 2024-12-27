import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { UserType } from '@/modules/common/types/user.type';

@ObjectType()
@Schema({ collection: 'sessions', timestamps: true })
export class Session {
  @Field()
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: Types.ObjectId;

  @Field(() => UserType)
  @Prop({ required: true, enum: UserType })
  userType: UserType;

  @Field()
  @Prop({ required: true })
  accessToken: string;

  @Field()
  @Prop({ required: true })
  refreshToken: string;

  @Field()
  @Prop({ required: true })
  accessTokenExpiresAt: Date;

  @Field()
  @Prop({ required: true })
  refreshTokenExpiresAt: Date;

  @Field()
  @Prop({ required: true })
  ip: string;

  @Field()
  @Prop()
  region: string;

  @Field()
  @Prop({ required: true })
  country: string;

  @Field()
  @Prop({ required: true })
  countryCode: string;

  @Field()
  @Prop()
  city: string;

  @Field({ description: 'Device name' })
  @Prop({ required: true })
  agent: string;

  @Field({ description: 'Device type (ios/android...)' })
  @Prop({ required: true })
  platform: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Field(() => [Number])
  @Prop({ required: true })
  coordinates: number[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;

export const SessionSchema = SchemaFactory.createForClass(Session);
