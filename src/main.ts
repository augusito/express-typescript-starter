import container from '../config/container';
import { Application } from './core/application';
import { LogFactory } from './core/logging';
import { UserHandler } from './user/user.handler';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  app.get('/', UserHandler.name);

  await app.listen(3000);
  logger.info(`Application started on: ${await app.getUrl()}`);
})();
