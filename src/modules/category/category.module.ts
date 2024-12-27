import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryResolver } from '@/modules/category/category.resolver';
import { Category, CategorySchema } from '@/modules/category/category.schema';
import { CategoryService } from '@/modules/category/category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
