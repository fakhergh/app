import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { DateTime } from 'luxon';
import { ulid } from 'ulid';

import { HasRole } from '@/common/decorators/has-role.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { CurrentUser } from '@/common/directives/current-user.directive';
import { AdminDuplicationError, AdminNotFoundError } from '@/modules/admin/admin.error';
import { Admin, AdminDocument } from '@/modules/admin/admin.schema';
import { AdminService } from '@/modules/admin/admin.service';
import {
  AdminPagination,
  AdminPaginationInput,
  CreateAdminInput,
  DeleteAdminInput,
  DisableAdminInput,
  EnableAdminInput,
  SendAdminResetPasswordLinkInput,
  UpdateAdminInput,
  UpdateAdminProfileInput,
} from '@/modules/admin/admin.type';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import type { RequestUser } from '@/modules/common/types/auth.type';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { UserType } from '@/modules/common/types/user.type';
import { Role } from '@/modules/role/role.schema';
import { RoleService } from '@/modules/role/role.service';

@Resolver(() => Admin)
export class AdminResolver extends NodeResolver<Admin> {
  constructor(
    private readonly adminService: AdminService,
    private readonly roleService: RoleService,
  ) {
    super();
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.READ)
  @Query(() => AdminPagination)
  async adminsPagination(
    @CurrentUser() currentUser: RequestUser,
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: AdminPaginationInput = {},
  ) {
    return this.adminService.getAdminsPagination(paginationArgs, {
      filter: { ...input.filter, id: { ne: currentUser._id.toString() } },
    });
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.CREATE)
  @Mutation(() => Admin)
  async createAdmin(@Args('input') input: CreateAdminInput) {
    const exists = await this.adminService.checkExistenceByEmail(input.email);

    if (exists) throw new AdminDuplicationError('User already exists');

    const resetPasswordToken: string = ulid().toLowerCase();
    const resetPasswordExpiresAt: Date = DateTime.now().plus({ days: 2 }).toJSDate();

    const admin = await this.adminService.createAdmin(input, resetPasswordToken, resetPasswordExpiresAt);

    const resetPasswordLink = this.adminService.generateAdminResetPasswordLink(admin.email, resetPasswordToken);

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.UPDATE)
  @Mutation(() => Admin)
  async updateAdmin(@Args('input') input: UpdateAdminInput) {
    const admin = await this.adminService.updateAdmin(input);

    if (!admin) throw new AdminNotFoundError('User not found');

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.DELETE)
  @Mutation(() => Admin)
  async deleteAdmin(@Args('input') input: DeleteAdminInput) {
    const admin = await this.adminService.deleteAdmin(input.id);

    if (!admin) throw new AdminNotFoundError('User not found');

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.UPDATE)
  @Mutation(() => Admin)
  async enableAdmin(@Args('input') input: EnableAdminInput) {
    const admin = await this.adminService.enableAdmin(input.id);

    if (!admin) throw new AdminNotFoundError('User not found');

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.UPDATE)
  @Mutation(() => Admin)
  async disableAdmin(@Args('input') input: DisableAdminInput) {
    const admin = await this.adminService.disableAdmin(input.id);

    if (!admin) throw new AdminNotFoundError('User not found');

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @HasPermission(PERMISSIONS.ADMIN.CREATE, PERMISSIONS.ADMIN.UPDATE)
  @Mutation(() => Admin)
  async sendAdminResetPasswordLink(@Args('input') input: SendAdminResetPasswordLinkInput) {
    const admin = await this.adminService.getAdminById(input.id);

    if (!admin) throw new AdminNotFoundError('User not found');

    const resetPasswordToken: string = ulid().toLowerCase();
    const resetPasswordExpiresAt: Date = DateTime.now().plus({ days: 2 }).toJSDate();

    await this.adminService.updateAdminResetToken(admin._id, resetPasswordToken, resetPasswordExpiresAt);

    const resetPasswordLink = this.adminService.generateAdminResetPasswordLink(admin.email, resetPasswordToken);

    return admin;
  }

  @HasRole(UserType.ADMIN)
  @Mutation(() => Admin)
  adminUpdateProfile(@CurrentUser() admin: Admin, @Args('input') input: UpdateAdminProfileInput) {
    return this.adminService.updateAdminProfile(admin._id, input);
  }

  @ResolveField(() => [Role])
  async roles(@Root() admin: AdminDocument) {
    return this.roleService.getRolesByIds(admin.roles);
  }

  @ResolveField(() => Boolean)
  async isTwoFactorEnabled(@Root() admin: AdminDocument) {
    return Boolean(admin.twoFactor?.enabled);
  }
}
