import { Application } from '../../lib/application';
import { IContainer } from '../../lib/container';
import { UserHandler } from './user.handler';
import { UserService } from './user.service';
import { JwtService } from 'lib/jwt';
import { AuthService } from './auth.service';
import { LoginHandler } from './login.handler';

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
          provide: LoginHandler.name,
          useFactory: (container: IContainer) => {
            return new LoginHandler(container.get(AuthService.name));
          },
        },
        {
          provide: AuthService.name,
          useFactory: (container: IContainer) => {
            return new AuthService(
              container.get(UserService.name),
              container.get(JwtService.name),
            );
          },
        },
      ],
    };
  }

  static registerRoutes(app: Application) {
    app.get('/users', UserHandler.name);
    app.post('/login', LoginHandler.name);
  }
}
