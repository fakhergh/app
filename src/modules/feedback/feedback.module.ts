import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerModule } from '../customer/customer.module';
import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { FeedbackResolver } from './feedback.resolver';
import { Feedback, FeedbackSchema } from './feedback.schema';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    CustomerModule,
    ServiceProviderModule,
  ],
  providers: [FeedbackResolver, FeedbackService],
})
export class FeedbackModule {}
