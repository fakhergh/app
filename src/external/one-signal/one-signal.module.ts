import { Module } from '@nestjs/common';

import { OneSignalService } from '@/external/one-signal/one-signal.service';

@Module({
  providers: [OneSignalService],
  exports: [OneSignalService],
})
export class OneSignalModule {}
