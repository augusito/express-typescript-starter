import { isFunction } from '../utils/lang.util';
import { IContainer } from '../container';
import { Application } from './application';
import { HookCollector } from './hooks/hook-collector';
import { HookContainer } from './hooks/hook-container';
import { HookFactory } from './hooks/hook-factory';
import { HttpAdapter } from './http-adapter';
import { MiddlewareContainer } from './middleware/middleware-container';
import { MiddlewareFactory } from './middleware/middleware-factory';
import { TaskExecutor } from './task/task-executor';

export class ApplicationModule {
  private static abortOnError = true;

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
            const instance = new Application(
              new HttpAdapter(),
              container.get(MiddlewareFactory.name),
              container.get(HookCollector.name),
              appOptions,
            );
            const target = this.createTarget(instance);
            return this.createAdapterProxy(target, new HttpAdapter());
          },
        },
      ],
    };
  }

  private static createTarget(instance: any) {
    return this.createProxy(instance);
  }

  private static createProxy(target: any) {
    const proxy = this.createTaskProxy();
    return new Proxy(target, {
      get: proxy,
      set: proxy,
    });
  }

  private static createTaskProxy() {
    return (receiver: Record<string, any>, prop: string) => {
      if (!(prop in receiver)) {
        return;
      }
      if (isFunction(receiver[prop])) {
        return this.createTaskExecutor(receiver, prop);
      }
      return receiver[prop];
    };
  }

  private static createAdapterProxy(app: Application, adapter: HttpAdapter) {
    const proxy = new Proxy(app, {
      get: (receiver: Record<string, any>, prop: string) => {
        const mapToProxy = (result: unknown) => {
          return result instanceof Promise
            ? result.then(mapToProxy)
            : result instanceof Application
            ? proxy
            : result;
        };

        if (!(prop in receiver) && prop in adapter) {
          return (...args: unknown[]) => {
            const result = this.createTaskExecutor(adapter, prop)(...args);
            return mapToProxy(result);
          };
        }

        if (isFunction(receiver[prop])) {
          return (...args: unknown[]) => {
            const result = receiver[prop](...args);
            return mapToProxy(result);
          };
        }

        return receiver[prop];
      },
    });

    return proxy;
  }

  private static createTaskExecutor(
    receiver: Record<string, any>,
    prop: string,
  ): Function {
    const teardown =
      this.abortOnError === false
        ? (err: unknown) => {
            throw err;
          }
        : undefined;

    return (...args: unknown[]) => {
      let result: unknown;
      TaskExecutor.execute(() => {
        result = receiver[prop](...args);
      }, teardown);

      return result;
    };
  }
}
