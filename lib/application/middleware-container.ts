import { IContainer, ProviderToken, Type } from '../container';
import { isType } from '../container/utils';
import { RequestHandlerMiddleware } from './middleware/request-handler-middleware';

export class MiddlewareContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error('Missing dependency middleware provider');
    }

    let middleware: any;

    if (this.container.has(token)) {
      middleware = this.container.get(token);
    } else {
      const tokenType = token as Type;
      middleware = new tokenType();
    }

    if (middleware?.handle) {
      middleware = new RequestHandlerMiddleware(middleware);
    }

    if (!middleware?.process) {
      throw new Error('Invalid middleware');
    }

    return middleware as T;
  }

  has(token: ProviderToken): boolean {
    if (this.container.has(token)) {
      return true;
    }

    return isType(token);
  }
}
