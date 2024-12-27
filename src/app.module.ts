import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from '@/app.controller';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { MigrationService } from '@/database/migration/migration.service';
import { GraphqlModule } from '@/graphql/graphql.module';

@Module({
  imports: [ConfigModule, DatabaseModule, TerminusModule, GraphqlModule],
  controllers: [AppController],
  providers: [MigrationService],
})
export class AppModule {
  constructor(private readonly migrationService: MigrationService) {}

  async onApplicationBootstrap() {
    try {
      await this.migrationService.runMigrations();
      //await this.seederService.seed();
      Logger.log('Migrations executed successfully', 'MongoDbMigration');
    } catch (err) {
      Logger.error('Error running migrations:', err);
    }
  }
}
