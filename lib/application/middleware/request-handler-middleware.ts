export class RequestHandlerMiddleware {
  constructor(private readonly handler: any) {}

  public process(req: any, res: any, next: any) {
    return this.handler.handle(req, res, next);
  }
}
