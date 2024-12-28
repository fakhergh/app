import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryModule } from '@/modules/category/category.module';
import { FileModule } from '@/modules/file/file.module';
import { ProfileDetailResolver } from '@/modules/service-provider/nested-resolvers/profile-detail.resolver';
import { ServiceProviderResolver } from '@/modules/service-provider/service-provider.resolver';
import { ServiceProvider, ServiceProviderSchema } from '@/modules/service-provider/service-provider.schema';
import { ServiceProviderService } from '@/modules/service-provider/service-provider.service';

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
