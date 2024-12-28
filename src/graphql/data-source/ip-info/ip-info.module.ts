import { Module } from '@nestjs/common';

import { IpInfoDatasource } from './ip-info.datasource';

@Module({
  providers: [IpInfoDatasource],
  exports: [IpInfoDatasource],
})
export class IpInfoDataSourceModule {}
