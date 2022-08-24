import { MiddlewareContainer } from '../middleware-container';

export class LazyLoadingMiddleware {
  constructor(
    private readonly container: MiddlewareContainer,
    private readonly middleware: string,
  ) {}

  public process(req: any, res: any, next: any) {
    const middleware: any = this.container.get(this.middleware);
    return middleware.process(req, res, next);
  }
}
