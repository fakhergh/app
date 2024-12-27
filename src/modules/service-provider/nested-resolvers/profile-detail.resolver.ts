import { ResolveField, Resolver, Root } from '@nestjs/graphql';

import { Category } from '@/modules/category/category.schema';
import { CategoryService } from '@/modules/category/category.service';
import { File } from '@/modules/file/file.schema';
import { ProfileDetail } from '@/modules/service-provider/service-provider.schema';

@Resolver(() => ProfileDetail)
export class ProfileDetailResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @ResolveField(() => File, { nullable: true })
  async image(@Root() profileDetail: ProfileDetail) {
    if (!profileDetail.image) return null;
  }

  @ResolveField(() => [Category])
  async categories(@Root() profileDetail: ProfileDetail) {
    if (!profileDetail.categoryIds) return [];

    return this.categoryService.getCategoriesByIds(profileDetail.categoryIds);
  }
}
