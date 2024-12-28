import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingHistoryModule } from '../booking-history/booking-history.module';
import { MessageResolver } from './message.resolver';
import { Message, MessageSchema } from './message.schema';
import { MessageService } from './message.service';
import { BookingHistoryMessageResolver } from './nested-resolvers/booking-history-message.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), BookingHistoryModule],
  providers: [MessageService, MessageResolver, BookingHistoryMessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
