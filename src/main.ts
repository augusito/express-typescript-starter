import container from '../config/container';
import { Application } from './core/application';
import { LogFactory } from './core/logging';

class AppService {
  sayHello(name: string): string {
    return `Hello ${name}!`;
  }
}

class AppHandler {
  constructor(private readonly appService: AppService) {}

  handle(req: any, res: any) {
    const { name = 'World' } = req.query;
    res.send(this.appService.sayHello(name as string));
  }
}

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  app.get('/', new AppHandler(new AppService()));

  await app.listen(3000);
  logger.info(`Application started on: ${await app.getUrl()}`);
})();
