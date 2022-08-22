import { Type } from '../container';
import { isType } from '../container/utils';
import { callableMiddlewareDecorator } from './middleware/callable-middleware-decorator';
import { HandlerMiddlewareDecorator } from './middleware/handler-middleware-decorator';

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

  public handler(middleware: Type): HandlerMiddlewareDecorator {
    return new HandlerMiddlewareDecorator(middleware);
  }

  public pipeline(...middleware: any[]) {
    return middleware.map((mid) => this.prepare(mid));
  }
}
