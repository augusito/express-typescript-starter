import * as Database from 'better-sqlite3';
import { IContainer, Provider } from '../../lib/container';

export class DatabaseModule {
  static register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: Database.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            const filename = config.db?.filename || ':memory:';
            const options = config.db?.options || {};

            return new Database(filename, options);
          },
        },
      ],
    };
  }
}
