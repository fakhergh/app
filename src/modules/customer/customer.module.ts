import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerResolver } from '@/modules/customer/customer.resolver';
import { Customer, CustomerSchema } from '@/modules/customer/customer.schema';
import { CustomerService } from '@/modules/customer/customer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  providers: [CustomerResolver, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
