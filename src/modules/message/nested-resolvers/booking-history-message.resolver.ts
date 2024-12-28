import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { BookingHistory } from '../../booking-history/booking-history.schema';
import { BookingHistoryService } from '../../booking-history/booking-history.service';
import { BookingHistoryFilterInput } from '../../booking-history/booking-history.type';
import { BookingHistoryMessage, Message } from '../message.schema';

@Resolver(() => BookingHistoryMessage)
export class BookingHistoryMessageResolver {
  constructor(private bookingHistoryService: BookingHistoryService) {}

  @ResolveField(() => BookingHistory, { nullable: true })
  bookingHistory(@Parent() message: Message) {
    const input: BookingHistoryFilterInput = { id: { eq: (message.content as any).bookingHistoryId.toString() } };

    return this.bookingHistoryService.getBookingHistory(input);
  }
}
