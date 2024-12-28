import { Module } from '@nestjs/common';

import { OneSignalService } from './one-signal.service';

@Module({
  providers: [OneSignalService],
  exports: [OneSignalService],
})
export class OneSignalModule {}
