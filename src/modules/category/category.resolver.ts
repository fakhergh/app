import { Args, Int, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import slugify from 'slugify';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { CategoryDuplicationError, CategoryNotFoundError } from '@/modules/category/category.error';
import { Category } from '@/modules/category/category.schema';
import { CategoryService } from '@/modules/category/category.service';
import {
  CategoryInput,
  CreateCategoryInput,
  DeleteCategoryInput,
  DisableCategoryInput,
  DisableCategoryShowOnTopInput,
  EnableCategoryInput,
  EnableCategoryShowOnTopInput,
  SortCategoriesInput,
  UpdateCategoryInput,
} from '@/modules/category/category.type';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { RequestUser } from '@/modules/common/types/auth.type';
import { Language } from '@/modules/common/types/language';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { UserType } from '@/modules/common/types/user.type';

@Resolver(() => Category)
export class CategoryResolver extends NodeResolver<Category> {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.READ)
  @Query(() => Int)
  async categoriesCount() {
    return this.categoryService.getCategoriesCount();
  }

  @HasRole(UserType.ADMIN, UserType.CUSTOMER, UserType.SERVICE_PROVIDER)
  @HasPermission(PERMISSIONS.CATEGORY.READ)
  @Query(() => [Category])
  async categories(
    @CurrentUser() currentUser: RequestUser,
    @Args('input', { nullable: true }) input: CategoryInput = {},
  ) {
    const options = { ...input, filter: input.filter ?? {} };
    if (currentUser.userType === UserType.CUSTOMER) options.filter.active = { eq: true };

    return this.categoryService.getCategories(options);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.CREATE)
  @Mutation(() => Category)
  async createCategory(@Args('input') input: CreateCategoryInput) {
    const slug = slugify(input.name.en, { lower: true, strict: true });

    const data = { ...input, parentPath: undefined, path: `/${slug}`, slug };

    if (input.parentId) {
      const parentCategory = await this.categoryService.getCategory({ id: { eq: input.parentId } });

      if (!parentCategory) throw new Error('Parent category not found');

      data.parentPath = parentCategory.path;
      data.path = `${parentCategory.path}/${slug}`;
    }

    const categoryBySlug = await this.categoryService.getCategoryBySlug(slug);

    if (categoryBySlug) throw new CategoryDuplicationError(`Category with slug "${slug}" already exists`);

    return this.categoryService.createCategory(data);
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Category)
  async updateCategory(@Args('input') input: UpdateCategoryInput) {
    const slug = slugify(input.name.en, { lower: true, strict: true });

    const categoryBySlug = await this.categoryService.getCategoryBySlug(slug);

    if (categoryBySlug && categoryBySlug._id.toString() !== input.id)
      throw new CategoryDuplicationError(`Category with slug "${slug}" already exists`);

    const category = await this.categoryService.updateCategory(input);

    if (!category) throw new CategoryNotFoundError('Category not found');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.DELETE)
  @Mutation(() => Category)
  async deleteCategory(@Args('input') input: DeleteCategoryInput) {
    const category = await this.categoryService.deleteCategory(input.id);

    if (!category) throw new CategoryNotFoundError('Category not exists');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Category)
  async enableCategory(@Args('input') input: EnableCategoryInput) {
    const category = await this.categoryService.setCategoryActive(input.id, true);

    if (!category) throw new CategoryNotFoundError('Category not exists');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Category)
  async disableCategory(@Args('input') input: DisableCategoryInput) {
    const category = await this.categoryService.setCategoryActive(input.id, false);

    if (!category) throw new CategoryNotFoundError('Category not exists');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Category)
  async enableCategoryShowOnTop(@Args('input') input: EnableCategoryShowOnTopInput) {
    const category = await this.categoryService.setCategoryShowOnTop(input.id, true);

    if (!category) throw new CategoryNotFoundError('Category not exists');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Category)
  async disableCategoryShowOnTop(@Args('input') input: DisableCategoryShowOnTopInput) {
    const category = await this.categoryService.setCategoryShowOnTop(input.id, false);

    if (!category) throw new CategoryNotFoundError('Category not exists');

    return category;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.CATEGORY.UPDATE)
  @Mutation(() => Boolean)
  async sortCategories(@Args('input') input: SortCategoriesInput) {
    await this.categoryService.sortCategories(input.ids);
    return true;
  }

  @ResolveField(() => String)
  nameByLanguage(@Root() category: Category, @Args('lang', { type: () => Language, nullable: true }) lang: Language) {
    return category.name[lang] ?? category.name[Language.EN];
  }
}
