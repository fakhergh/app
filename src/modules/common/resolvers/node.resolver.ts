import { ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Node } from '../types/node.type';

@Resolver(() => Node)
export class NodeResolver<T extends { _id: Types.ObjectId }> {
  @ResolveField()
  id(parent: T) {
    return parent._id;
  }
}
