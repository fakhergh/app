import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@ObjectType()
@Schema({ collection: 'roles', timestamps: true })
export class Role {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => RoleType)
  @Prop({ default: RoleType.USER, enum: RoleType })
  type: RoleType;

  @Prop({ ref: 'Permission', type: [mongoose.Schema.Types.ObjectId] })
  permissions: Types.ObjectId[];

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);
