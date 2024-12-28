import { Args, Query, Resolver } from '@nestjs/graphql';

import { BookingHistory } from '../booking-history/booking-history.schema';
import { BookingHistoryService } from '../booking-history/booking-history.service';
import { BookingHistoryConnection, BookingHistoryConnectionInput } from '../booking-history/booking-history.type';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { ConnectionArgs } from '../common/types/query.type';

@Resolver(() => BookingHistory)
export class BookingHistoryResolver extends NodeResolver<BookingHistory> {
  constructor(private readonly bookingHistoryService: BookingHistoryService) {
    super();
  }

  @Query(() => BookingHistoryConnection)
  async bookingHistoriesConnection(
    @Args() connectionArgs: ConnectionArgs,
    @Args('input', { nullable: true }) input: BookingHistoryConnectionInput = {},
  ) {
    return this.bookingHistoryService.getPaginatedBookingHistories(connectionArgs, input);
  }
}
