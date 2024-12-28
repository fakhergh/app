import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { HasRole } from '../../common/decorators/has-role.decorator';
import { CurrentUser } from '../../common/directives/current-user.directive';
import { Booking } from '../booking/booking.schema';
import { BookingService } from '../booking/booking.service';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { RequestUser } from '../common/types/auth.type';
import { ConnectionArgs } from '../common/types/query.type';
import { UserType } from '../common/types/user.type';
import { CustomerService } from '../customer/customer.service';
import { Message } from '../message/message.schema';
import { MessageService } from '../message/message.service';
import { MessageConnection, MessageConnectionInput } from '../message/message.type';
import { ServiceProvider } from '../service-provider/service-provider.schema';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { Conversation } from './conversation.schema';
import { ConversationService } from './conversation.service';
import { ConversationConnection, ConversationConnectionInput, ConversationFilterInput } from './conversation.type';

@Resolver(() => Conversation)
export class ConversationResolver extends NodeResolver<Conversation> {
  constructor(
    private readonly conversationsService: ConversationService,
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
    private readonly serviceProviderService: ServiceProviderService,
    private readonly customerService: CustomerService,
  ) {
    super();
  }

  @HasRole(UserType.CUSTOMER, UserType.SERVICE_PROVIDER)
  @Query(() => ConversationConnection)
  async conversationsConnection(
    @CurrentUser() currentUser: RequestUser,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: ConversationConnectionInput = {},
  ) {
    const filter = { ...input.filter };

    switch (currentUser.userType) {
      case UserType.CUSTOMER:
        filter.customerId = { eq: currentUser._id.toString() };
        break;
      case UserType.SERVICE_PROVIDER:
        filter.serviceProviderId = { eq: currentUser._id.toString() };
        break;
    }

    return this.conversationsService.getConversationsCursorPagination(connectionArgs, input);
  }

  @HasRole(UserType.CUSTOMER, UserType.SERVICE_PROVIDER)
  @Query(() => Conversation, { nullable: true })
  async conversation(
    @CurrentUser() currentUser: RequestUser,
    @Args('input', { nullable: true }) filter: ConversationFilterInput = {},
  ) {
    switch (currentUser.userType) {
      case UserType.CUSTOMER:
        filter.customerId = { eq: currentUser._id.toString() };
        break;
      case UserType.SERVICE_PROVIDER:
        filter.serviceProviderId = { eq: currentUser._id.toString() };
        break;
    }

    return this.conversationsService.getConversation(filter);
  }

  @ResolveField(() => ServiceProvider, { nullable: true })
  serviceProvider(@Parent() conversation: Conversation) {
    return this.serviceProviderService.getServiceProvider({ id: { eq: conversation.serviceProviderId.toString() } });
  }

  @ResolveField(() => ServiceProvider, { nullable: true })
  customer(@Parent() conversation: Conversation) {
    return this.customerService.getCustomer({ id: { eq: conversation.customerId.toString() } });
  }

  @ResolveField(() => Booking, { nullable: true })
  booking(@Parent() conversation: Conversation) {
    return Types.ObjectId.isValid(conversation.bookingId)
      ? this.bookingService.getBooking({ id: { eq: conversation.bookingId.toString() } })
      : null;
  }

  @ResolveField(() => Message)
  lastMessage(@Parent() conversation: Conversation) {
    return this.messageService.getLastMessage(conversation._id);
  }

  @ResolveField(() => MessageConnection)
  messages(
    @Parent() conversation: Conversation,
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: MessageConnectionInput = {},
  ) {
    const inputOptions: MessageConnectionInput = {
      filter: {
        ...input.filter,
        conversationId: { eq: conversation._id.toString() },
      },
    };

    return this.messageService.getMessagesCursorPagination(connectionArgs, inputOptions);
  }
}
