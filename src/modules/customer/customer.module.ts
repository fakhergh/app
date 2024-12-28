import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerResolver } from './customer.resolver';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerService } from './customer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  providers: [CustomerResolver, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
