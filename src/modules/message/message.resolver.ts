import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { NodeResolver } from '../common/resolvers/node.resolver';
import { Message, MessageContent } from './message.schema';

@Resolver(() => Message)
export class MessageResolver extends NodeResolver<Message> {
  @ResolveField(() => MessageContent)
  content(@Parent() message: Message) {
    return message;
  }
}
