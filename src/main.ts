import { container } from '../config/container';
import { Application } from './core/application';
import { LogFactory } from './core/logging';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  await app.listen(3000);

  (await import('../config/middleware')).default(app);
  (await import('../config/routes')).default(app);
  logger.info(`Application is running on: ${await app.getUrl()}`);
})();
