import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { capitalize, lowercase } from '@/common/utils/formatter';
import { Permission, PermissionAction, PermissionType } from '@/modules/permission/permission.schema';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async seed() {
    Logger.log('Start permissions seeder ', 'Seeder');

    try {
      const permissionsFilters = Object.keys(PermissionType).reduce(
        (prev: Array<FilterQuery<Permission>>, permission) => {
          prev.push(
            { type: permission, action: PermissionAction.READ },
            { type: permission, action: PermissionAction.CREATE },
            { type: permission, action: PermissionAction.UPDATE },
            { type: permission, action: PermissionAction.DELETE },
          );
          return prev;
        },
        [],
      );

      for (const filter of permissionsFilters) {
        const name = `${capitalize(filter.action)} ${lowercase(filter.type.replaceAll('_', ' '))}`;
        const update = { $setOnInsert: { ...filter, name } };
        const options = { upsert: true };

        /*await*/ this.permissionModel.updateOne(filter, update, options);
      }

      Logger.log('Finish permissions seeder ', 'Seeder');
    } catch (error) {
      Logger.error(error, 'Seeder');
    }
  }
}
