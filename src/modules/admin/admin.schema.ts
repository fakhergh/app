import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false, versionKey: false })
class TwoFactorSchema {
  @Prop({ default: false })
  enabled: boolean;

  @Prop()
  secret: string;

  @Prop()
  iv: string;
}

@ObjectType()
@Schema({ collection: 'admins', timestamps: true })
export class Admin {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: [], ref: 'Role', type: [mongoose.Schema.Types.ObjectId] })
  roles: Types.ObjectId[];

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: null })
  twoFactor?: TwoFactorSchema | null;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type AdminDocument = HydratedDocument<Admin>;

export const AdminSchema = SchemaFactory.createForClass(Admin);
