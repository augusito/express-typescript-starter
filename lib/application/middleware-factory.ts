import { Type } from '../container';
import { isType } from '../container/utils';
import { isString } from '../utils/lang.util';
import { MiddlewareContainer } from './middleware-container';
import { callableMiddlewareDecorator } from './middleware/callable-middleware-decorator';
import { LazyLoadingMiddleware } from './middleware/lazy-loading-middleware';
import { RequestHandlerMiddleware } from './middleware/request-handler-middleware';

export class MiddlewareFactory {
  constructor(private readonly container: MiddlewareContainer) {}

  public prepare(middleware: any) {
    if (middleware?.process) {
      return middleware;
    }

    if (middleware?.handle) {
      return this.handler(middleware);
    }

    if (isType(middleware)) {
      return this.callable(middleware);
    }

    if (Array.isArray(middleware)) {
      return this.pipeline(...middleware);
    }

    if (!isString(middleware) || middleware === '') {
      throw new Error('Invalid middleware');
    }

    return this.lazy(middleware);
  }

  public callable(middleware: Type): callableMiddlewareDecorator {
    return new callableMiddlewareDecorator(middleware);
  }

  public handler(middleware: Type): RequestHandlerMiddleware {
    return new RequestHandlerMiddleware(middleware);
  }

  public lazy(middleware: string) {
    return new LazyLoadingMiddleware(this.container, middleware);
  }

  public pipeline(...middleware: any[]) {
    return middleware.map((mid) => this.prepare(mid));
  }
}
