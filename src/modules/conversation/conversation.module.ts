import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingModule } from '../booking/booking.module';
import { CustomerModule } from '../customer/customer.module';
import { MessageModule } from '../message/message.module';
import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { ConversationResolver } from './conversation.resolver';
import { Conversation, ConversationSchema } from './conversation.schema';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    MessageModule,
    ServiceProviderModule,
    CustomerModule,
    forwardRef(() => BookingModule),
  ],
  providers: [ConversationResolver, ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
