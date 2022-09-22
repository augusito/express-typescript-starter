import { Application } from '../../lib/application';
import { IContainer } from '../../lib/container';
import { JwtService } from '../../lib/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginHandler } from './login.handler';

export class AuthModule {
  static register() {
    return {
      providers: [
        {
          provide: LoginHandler.name,
          useFactory: (container: IContainer) => {
            return new LoginHandler(container.get(AuthService.name));
          },
        },
        {
          provide: JwtService.name,
          useFactory: (container: IContainer) => {
            return new JwtService({
              secret: 'secretKey',
              signOptions: { expiresIn: '60s' },
            });
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
    app.post('/auth/login', LoginHandler.name);
  }
}
