import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@ObjectType()
@Schema({ collection: 'favorite_services', timestamps: true })
export class FavoriteService {
  _id: Types.ObjectId;

  @Field()
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' })
  serviceProviderId: Types.ObjectId;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type FavoriteServiceDocument = HydratedDocument<FavoriteService>;

export const FavoriteServiceSchema = SchemaFactory.createForClass(FavoriteService);

FavoriteServiceSchema.index({ customerId: 1, serviceProviderId: 1 }, { unique: true });
