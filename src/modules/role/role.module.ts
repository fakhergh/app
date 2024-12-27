import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionModule } from '@/modules/permission/permission.module';
import { RoleResolver } from '@/modules/role/role.resolver';
import { Role, RoleSchema } from '@/modules/role/role.schema';
import { RoleService } from '@/modules/role/role.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]), forwardRef(() => PermissionModule)],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
