import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class MigrationService {
  async runMigrations() {
    return new Promise((resolve, reject) => {
      exec(`migrate-mongo up`, (err, stdout) => {
        if (err) {
          Logger.error(`Error running migrations: ${err}`);
          reject(err);
        } else {
          Logger.log(stdout, 'MongoDbMigration');
          resolve(stdout);
        }
      });
    });
  }
}
