import { Application } from '../core/application';
import { IContainer } from '../core/container';
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
      ],
    };
  }

  static registerRoutes(app: Application) {
    app.get('/users', UserHandler.name);
  }
}
