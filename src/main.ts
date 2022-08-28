import { container } from '../config/container';
import { Application } from './core/application';
import { LogFactory } from './core/logging';
import { dynamicRequire } from './core/utils/dynamic-require';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  await app.listen(3000);

  dynamicRequire('config/middleware')(app);
  dynamicRequire('config/routes')(app);
  logger.info(`Application is running on: ${await app.getUrl()}`);
})();
