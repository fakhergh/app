import { Module } from '@nestjs/common';

import { IpInfoDatasource } from '@/graphql/data-source/ip-info/ip-info.datasource';

@Module({
  providers: [IpInfoDatasource],
  exports: [IpInfoDatasource],
})
export class IpInfoDataSourceModule {}
