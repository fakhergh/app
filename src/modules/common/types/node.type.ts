import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Node {
  @Field(() => ID)
  id: string;
}
