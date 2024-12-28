import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class BaseSchema {
  _id: Types.ObjectId;

  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
