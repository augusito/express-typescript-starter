import { IContainer } from '../container';
import { HttpAdapter } from '../http';
import { Application } from './application';
import { HookFactory } from './hooks/hook-factory';
import { HookContainer } from './hooks/hook-container';
import { MiddlewareContainer } from './middleware-container';
import { MiddlewareFactory } from './middleware-factory';
import { HookCollector } from './hooks/hook-collector';

export class ApplicationModule {
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
          provide: HookContainer.name,
          useFactory: (container: IContainer) => {
            return new HookContainer(container);
          },
        },
        {
          provide: HookFactory.name,
          useFactory: (container: IContainer) => {
            return new HookFactory(container.get(HookContainer.name));
          },
        },
        {
          provide: HookCollector.name,
          useFactory: (container: IContainer) => {
            const config: any = container.get('config') ?? {};
            return new HookCollector(
              container.get(HookFactory.name),
              config?.hooks,
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
              container.get(HookCollector.name),
              appOptions,
            );
          },
        },
      ],
    };
  }
}
