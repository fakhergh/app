import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { AuthProvider } from '../common/types/auth.type';

@ObjectType()
@Schema({ collection: 'customers', timestamps: true })
export class Customer {
  _id: Types.ObjectId;

  @Field()
  id: string;

  @Prop()
  initialName: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: AuthProvider })
  authProvider: AuthProvider;

  @Prop()
  verifyAccountToken: string;

  @Field()
  @Prop({ default: false })
  verified: boolean;

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  forgotPasswordToken: string;

  @Prop()
  forgotPasswordExpiresAt: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type CustomerDocument = HydratedDocument<Customer>;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
