import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerAddressResolver } from '@/modules/customer-address/customer-address.resolver';
import { CustomerAddress, CustomerAddressSchema } from '@/modules/customer-address/customer-address.schema';
import { CustomerAddressService } from '@/modules/customer-address/customer-address.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomerAddress.name, schema: CustomerAddressSchema }])],
  providers: [CustomerAddressResolver, CustomerAddressService],
  exports: [CustomerAddressService],
})
export class CustomerAddressModule {}
