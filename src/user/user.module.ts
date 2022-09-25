import * as Database from 'better-sqlite3';
import { Application } from '../../lib/application';
import { IContainer, Provider } from '../../lib/container';
import { UserCreateHandler } from './user-create.handler';
import { UserListHandler } from './user-list.handler';
import { UserService } from './user.service';

export class UserModule {
  static register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: UserService.name,
          useFactory: (container: IContainer) =>
            new UserService(container.get(Database.name)),
        },
        {
          provide: UserListHandler.name,
          useFactory: (container: IContainer) => {
            return new UserListHandler(container.get(UserService.name));
          },
        },
        {
          provide: UserCreateHandler.name,
          useFactory: (container: IContainer) => {
            return new UserCreateHandler(container.get(UserService.name));
          },
        },
      ],
    };
  }

  static registerRoutes(app: Application) {
    app.get('/users/:id', UserListHandler.name);
    app.post('/users', UserCreateHandler.name);
  }
}
