import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@ObjectType()
@Schema({ _id: false, versionKey: false })
class CategoryName {
  @Field()
  @Prop()
  en: string;

  @Field()
  @Prop()
  ar: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class Category {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  parentId: Types.ObjectId;

  @Prop()
  parentPath: string;

  @Prop({ lowercase: true, trim: true, required: true })
  slug: string;

  @Field()
  @Prop({ lowercase: true, trim: true, required: true })
  path: string;

  @Field(() => CategoryName)
  @Prop()
  name: CategoryName;

  @Field({ nullable: true })
  @Prop()
  icon: string;

  @Field()
  @Prop({ default: 0 })
  rate: number;

  @Field()
  @Prop({ default: false })
  showOnTop: boolean;

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Field({ nullable: true })
  @Prop()
  position: number;

  @Prop({ default: false })
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
