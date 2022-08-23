import { Type } from '../container';
import { isType } from '../container/utils';
import { callableMiddlewareDecorator } from './middleware/callable-middleware-decorator';
import { RequestHandlerMiddleware } from './middleware/request-handler-middleware';

export class MiddlewareFactory {
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

    throw new Error('Invalid middleware');
  }

  public callable(middleware: Type): callableMiddlewareDecorator {
    return new callableMiddlewareDecorator(middleware);
  }

  public handler(middleware: Type): RequestHandlerMiddleware {
    return new RequestHandlerMiddleware(middleware);
  }

  public pipeline(...middleware: any[]) {
    return middleware.map((mid) => this.prepare(mid));
  }
}
