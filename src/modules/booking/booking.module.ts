import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingHistoryModule } from '../booking-history/booking-history.module';
import { CategoryModule } from '../category/category.module';
import { Category, CategorySchema } from '../category/category.schema';
import { ConversationModule } from '../conversation/conversation.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerAddressModule } from '../customer-address/customer-address.module';
import { MessageModule } from '../message/message.module';
import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { BookingResolver } from './booking.resolver';
import { Booking, BookingSchema } from './booking.schema';
import { BookingService } from './booking.service';
import { BookingCountByCategoryResolver } from './nested-resolvers/booking-count-by-category.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    BookingHistoryModule,
    CustomerModule,
    ServiceProviderModule,
    CategoryModule,
    CustomerAddressModule,
    MessageModule,
    forwardRef(() => ConversationModule),
  ],
  providers: [BookingResolver, BookingService, BookingCountByCategoryResolver],
  exports: [BookingService],
})
export class BookingModule {}
