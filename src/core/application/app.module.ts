import { IContainer } from '../container';
import { HttpAdapter } from '../http';
import { Application } from './application';
import { MiddlewareContainer } from './middleware-container';
import { MiddlewareFactory } from './middleware-factory';

export class AppModule {
  static register() {
    return {
      providers: [
        {
          provide: MiddlewareContainer.name,
          useFactory: (container: IContainer) => {
            return new MiddlewareContainer(container);
          },
        },
        {
          provide: MiddlewareFactory.name,
          useFactory: (container: IContainer) => {
            return new MiddlewareFactory(
              container.get(MiddlewareContainer.name),
            );
          },
        },
        {
          provide: Application.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            const appOptions = config.app?.options ?? {};
            return new Application(
              container.get(HttpAdapter.name),
              container.get(MiddlewareFactory.name),
              appOptions,
            );
          },
        },
      ],
    };
  }
}
