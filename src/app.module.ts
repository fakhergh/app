import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule, TerminusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
