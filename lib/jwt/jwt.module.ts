import { IContainer, Provider } from '../container';
import { JwtService } from './jwt.service';

export class JwtModule {
  static register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: JwtService.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            const jwtOptions = config.jwt.optons;
            return new JwtService(jwtOptions);
          },
        },
      ],
    };
  }
}
