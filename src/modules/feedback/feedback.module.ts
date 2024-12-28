import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerModule } from '../customer/customer.module';
import { FeedbackResolver } from '../feedback/feedback.resolver';
import { Feedback, FeedbackSchema } from '../feedback/feedback.schema';
import { FeedbackService } from '../feedback/feedback.service';
import { ServiceProviderModule } from '../service-provider/service-provider.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    CustomerModule,
    ServiceProviderModule,
  ],
  providers: [FeedbackResolver, FeedbackService],
})
export class FeedbackModule {}
