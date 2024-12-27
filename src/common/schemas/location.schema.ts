import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType()
@Schema({ _id: false, versionKey: false })
export class LocationSchema {
  @Prop({ default: 'Point' })
  type: string;

  @Field()
  @Prop()
  address: string;

  @Field(() => [Number])
  @Prop()
  coordinates: Array<number>;
}
