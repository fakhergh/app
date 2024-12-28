import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingHistoryResolver } from '../booking-history/booking-history.resolver';
import { BookingHistory, BookingHistorySchema } from '../booking-history/booking-history.schema';
import { BookingHistoryService } from '../booking-history/booking-history.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: BookingHistory.name, schema: BookingHistorySchema }])],
  providers: [BookingHistoryResolver, BookingHistoryService],
  exports: [BookingHistoryService],
})
export class BookingHistoryModule {}
