import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

import { Public } from '@/common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private mongodb: MongooseHealthIndicator,
  ) {}

  @Public()
  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.mongodb.pingCheck('database')]);
  }
}
