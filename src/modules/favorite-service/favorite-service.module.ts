import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { FavoriteServiceResolver } from './favorite-service.resolver';
import { FavoriteService, FavoriteServiceSchema } from './favorite-service.schema';
import { FavoriteServiceService } from './favorite-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FavoriteService.name, schema: FavoriteServiceSchema }]),
    forwardRef(() => ServiceProviderModule),
  ],
  providers: [FavoriteServiceResolver, FavoriteServiceService],
  exports: [FavoriteServiceService],
})
export class FavoriteServiceModule {}
