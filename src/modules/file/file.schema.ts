import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ collection: 'files', timestamps: true })
export class File {
  @Field(() => ID)
  id: string;

  @Prop({ required: true })
  assetId: string;

  @Prop({ required: true })
  filename: string;

  @Field()
  @Prop({ required: true })
  url: string;

  @Prop()
  folder?: string;

  @Field({ nullable: true })
  @Prop()
  width?: number;

  @Field({ nullable: true })
  @Prop()
  height?: number;

  @Field()
  @Prop({ required: true })
  size: number;

  @Field()
  @Prop({ required: true })
  type: string;

  @Field()
  @Prop({ required: true })
  extension: string;

  @Prop()
  codec?: string;

  @Prop()
  bitRate?: number;

  @Field({ nullable: true })
  @Prop()
  duration?: number;

  @Prop()
  frameRate: number;

  @Prop()
  frequency?: number;

  @Prop()
  channels?: number;

  @Prop()
  channelLayout?: string;

  @Prop({ required: true })
  etag: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data?: any;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type FileDocument = HydratedDocument<File>;

export const FileSchema = SchemaFactory.createForClass(File);
