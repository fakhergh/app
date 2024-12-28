import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

//import { LocationSchema } from '@/common/schemas/location.schema';

@ObjectType()
@Schema({ collection: 'customer_addresses', timestamps: true })
export class CustomerAddress {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Field(() => ID)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  customerId: Types.ObjectId;

  /*@Field()
  @Prop({ required: true })
  location?: LocationSchema;*/

  @Field()
  @Prop({ required: true })
  addressDetails?: string;

  @Field()
  @Prop({ required: true })
  city?: string;

  @Field()
  @Prop({ required: true })
  country?: string;

  @Field()
  @Prop({ required: true })
  phoneNumber: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ default: false })
  default: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type CustomerAddressDocument = HydratedDocument<CustomerAddress>;

export const CustomerAddressSchema = SchemaFactory.createForClass(CustomerAddress);
