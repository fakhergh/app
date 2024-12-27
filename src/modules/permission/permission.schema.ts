import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum PermissionType {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CATEGORY = 'CATEGORY',
  BOOKING = 'BOOKING',
  CONVERSATION = 'CONVERSATION',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  FILE = 'FILE',
  NOTIFICATION = 'NOTIFICATION',
  FEEDBACK = 'FEEDBACK',
}

export enum PermissionAction {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@ObjectType()
@Schema({ collection: 'permissions', timestamps: true })
export class Permission {
  _id: Types.ObjectId;

  @Field()
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => PermissionType)
  @Prop({ required: true, enum: PermissionType })
  type: PermissionType;

  @Field(() => PermissionAction)
  @Prop({ required: true, enum: PermissionAction })
  action: PermissionAction;

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

export type PermissionDocument = HydratedDocument<Permission>;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
