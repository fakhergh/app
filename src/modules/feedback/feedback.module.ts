import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerModule } from '@/modules/customer/customer.module';
import { FeedbackResolver } from '@/modules/feedback/feedback.resolver';
import { Feedback, FeedbackSchema } from '@/modules/feedback/feedback.schema';
import { FeedbackService } from '@/modules/feedback/feedback.service';
import { ServiceProviderModule } from '@/modules/service-provider/service-provider.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    CustomerModule,
    ServiceProviderModule,
  ],
  providers: [FeedbackResolver, FeedbackService],
})
export class FeedbackModule {}
