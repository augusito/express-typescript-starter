import { container } from '../config/container';
import { Application } from '../lib/application';
import { LogFactory } from '../lib/logging';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application>(Application.name);
  await app.listen(3000);

  (await import('../config/middleware')).default(app);
  (await import('../config/routes')).default(app);
  logger.info(`Application is running on: ${await app.getUrl()}`);
})();
