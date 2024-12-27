import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionResolver } from '@/modules/permission/permission.resolver';
import { Permission, PermissionSchema } from '@/modules/permission/permission.schema';
import { PermissionSeeder } from '@/modules/permission/permission.seeder';
import { PermissionService } from '@/modules/permission/permission.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  providers: [PermissionResolver, PermissionService, PermissionSeeder],
  exports: [PermissionService],
})
export class PermissionModule implements OnApplicationBootstrap {
  constructor(private readonly permissionSeeder: PermissionSeeder) {}

  async onApplicationBootstrap() {
    await this.permissionSeeder.seed();
  }
}
