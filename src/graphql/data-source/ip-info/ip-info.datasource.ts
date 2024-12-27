import { RESTDataSource } from '@apollo/datasource-rest';

import { IpInfo } from '@/graphql/data-source/ip-info/ip-info.type';

export class IpInfoDatasource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://get.geojs.io/v1/';
  }

  getIpInfo(ip: string): Promise<IpInfo> {
    return this.get(ip.startsWith('::') ? 'ip/geo.json' : `ip/geo/${ip}.json`);
  }
}
