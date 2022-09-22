import { Application } from '../../lib/application';
import { IContainer } from '../../lib/container';
import { UserCreateHandler } from './user-create.handler';
import { UserHandler } from './user.handler';
import { UserService } from './user.service';

export class UserModule {
  static register() {
    return {
      providers: [
        {
          provide: UserService.name,
          useClass: UserService,
        },
        {
          provide: UserHandler.name,
          useFactory: (container: IContainer) => {
            return new UserHandler(container.get(UserService.name));
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
    app.get('/users', UserHandler.name);
    app.post('/users', UserCreateHandler.name);
  }
}
