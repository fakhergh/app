import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminResolver } from '@/modules/admin/admin.resolver';
import { Admin, AdminSchema } from '@/modules/admin/admin.schema';
import { AdminService } from '@/modules/admin/admin.service';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), forwardRef(() => RoleModule)],
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
