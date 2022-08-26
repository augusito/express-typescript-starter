import { container } from '../config/container';
import { Application } from './core/application';
import { LogFactory } from './core/logging';
import { dynamicRequire } from './core/utils/dynamic-require';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  dynamicRequire('config/routes')(app);
  await app.listen(3000);
  logger.info(`Application started on: ${await app.getUrl()}`);
})();
