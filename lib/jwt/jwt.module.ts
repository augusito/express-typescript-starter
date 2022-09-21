import { IContainer, Provider } from '../container';
import { JwtService } from './jwt.service';

export class JwtModule {
  static register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: JwtService.name,
          useFactory: (container: IContainer) => {
            return new JwtService({
              secret: 'secretKey',
              signOptions: { expiresIn: '60s' },
            });
          },
        },
      ],
    };
  }
}
