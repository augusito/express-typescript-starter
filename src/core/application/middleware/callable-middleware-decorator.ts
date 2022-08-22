export class callableMiddlewareDecorator {
  constructor(private readonly callable: any) {}
  public process(req: any, res: any, next: any) {
    return this.callable(req, res, next);
  }
}
