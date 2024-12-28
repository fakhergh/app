import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerAddressResolver } from '../customer-address/customer-address.resolver';
import { CustomerAddress, CustomerAddressSchema } from '../customer-address/customer-address.schema';
import { CustomerAddressService } from '../customer-address/customer-address.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomerAddress.name, schema: CustomerAddressSchema }])],
  providers: [CustomerAddressResolver, CustomerAddressService],
  exports: [CustomerAddressService],
})
export class CustomerAddressModule {}
