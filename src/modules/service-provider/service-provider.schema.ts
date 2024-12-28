import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { LocationSchema } from '../../common/schemas/location.schema';

@ObjectType()
@Schema({ _id: false, versionKey: false })
class ReviewInformation {
  @Field()
  @Prop({ default: 0, required: false })
  rate?: number;

  @Field()
  @Prop({ default: 0, required: false })
  count?: number;
}

@ObjectType()
@Schema({ _id: false, versionKey: false })
class DayShift {
  @Field()
  @Prop()
  start: string;

  @Field()
  @Prop()
  end: string;
}

@ObjectType()
@Schema({ _id: false, versionKey: false })
class OperatingDay {
  @Field()
  @Prop()
  open: boolean;

  @Field(() => [DayShift])
  @Prop()
  shifts: Array<DayShift>;

  @Field(() => [String])
  @Prop()
  timeSlots: Array<string>;
}

@ObjectType()
@Schema({ _id: false, versionKey: false })
class OperatingDays {
  @Field()
  @Prop()
  monday: OperatingDay;

  @Field()
  @Prop()
  tuesday: OperatingDay;

  @Field()
  @Prop()
  wednesday: OperatingDay;

  @Field()
  @Prop()
  thursday: OperatingDay;

  @Field()
  @Prop()
  friday: OperatingDay;

  @Field()
  @Prop()
  saturday: OperatingDay;

  @Field()
  @Prop()
  sunday: OperatingDay;
}

@ObjectType()
@Schema({ _id: false, versionKey: false })
class OperatingHours {
  @Field()
  @Prop()
  days: OperatingDays;
}

@ObjectType()
@Schema({ _id: false, versionKey: false })
export class ProfileDetail {
  @Prop({ ref: 'File' })
  image: Types.ObjectId;

  @Field()
  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: [] })
  categoryIds: Array<Types.ObjectId>;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ default: [], type: Array<string> })
  phoneNumbers?: Array<string>;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field()
  @Prop()
  location?: LocationSchema;

  @Field({ nullable: true })
  @Prop()
  operatingHours: OperatingHours;

  @Prop({ ref: 'File' })
  gallery: Array<Types.ObjectId>;
}

@ObjectType()
@Schema({ collection: 'service_providers', timestamps: true })
export class ServiceProvider {
  _id: Types.ObjectId;

  @Field()
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Field({ nullable: true })
  @Prop()
  profileDetail?: ProfileDetail;

  @Field({ nullable: true })
  @Prop()
  reviewInformation?: ReviewInformation;

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Field()
  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  deleted: boolean;

  distance?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type ServiceProviderDocument = HydratedDocument<ServiceProvider>;

export const ServiceProviderSchema = SchemaFactory.createForClass(ServiceProvider);

ServiceProviderSchema.index({ 'profileDetail.location': '2dsphere' });
