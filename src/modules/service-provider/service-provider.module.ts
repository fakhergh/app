import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryModule } from '../category/category.module';
import { FileModule } from '../file/file.module';
import { ProfileDetailResolver } from '../service-provider/nested-resolvers/profile-detail.resolver';
import { ServiceProviderResolver } from '../service-provider/service-provider.resolver';
import { ServiceProvider, ServiceProviderSchema } from '../service-provider/service-provider.schema';
import { ServiceProviderService } from '../service-provider/service-provider.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServiceProvider.name, schema: ServiceProviderSchema }]),
    CategoryModule,
    FileModule,
  ],
  providers: [ServiceProviderResolver, ServiceProviderService, ProfileDetailResolver],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
