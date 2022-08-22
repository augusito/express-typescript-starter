import { NextFunction, Request, Response } from 'express';
import { Application, MiddlewareFactory } from './core/application';
import { HttpAdapter } from './core/http';
import { LogFactory } from './core/logging';

class AppService {
  sayHello(name: string): string {
    return `Hello ${name}!`;
  }
}

class AppHandler {
  constructor(private readonly appService: AppService) {}

  handle(req: Request, res: Response) {
    const { name = 'World' } = req.query;
    res.send(this.appService.sayHello(name as string));
  }
}
class Middleware {
  process(req: Request, res: Response, next: NextFunction) {
    const { name = 'World' } = req.query;
    res.send(`Hello ${name}!`);
  }
}

const fnMiddleware = (req: Request, res: Response) => {
  const { name = 'There' } = req.query;
  res.send(`Hello ${name}!`);
};

const factory = new MiddlewareFactory();
const middleware = factory.prepare(new AppHandler(new AppService()));

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = new Application(new HttpAdapter(), { cors: true });
  app.get('/', [
    (req: Request, res: Response, next: NextFunction) =>
      middleware.process(req, res, next),
  ]);

  await app.listen(3000);
  logger.info(`Application started on: ${await app.getUrl()}`);
})();
