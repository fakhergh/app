import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OneSignal from 'onesignal-node';

import { EnvironmentVariables } from '@/config/config.type';

@Injectable()
export class OneSignalService {
  private oneSignal: OneSignal.Client;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<EnvironmentVariables['oneSignal']>('oneSignal');
    this.oneSignal = new OneSignal.Client(config.appId, config.apiKey);
  }

  async sendNotification(message: string, userIds: string[]) {
    const notification = {
      contents: { en: message },
      include_player_ids: userIds,
    };

    try {
      return await this.oneSignal.createNotification(notification);
    } catch (error) {
      if (error instanceof OneSignal.HTTPError) {
        console.error(error.statusCode);
        console.error(error.body);
      } else {
        console.error(error);
      }
    }
  }
}
