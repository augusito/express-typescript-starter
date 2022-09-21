import { container } from '../config/container';
import { Application, HttpAdapter } from '../lib/application';
import { LogFactory } from '../lib/logging';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = container.get<Application & HttpAdapter>(Application.name);
  await app.listen(3000);

  (await import('../config/middleware')).default(app);
  (await import('../config/routes')).default(app);
  logger.info(`Application is running on: ${await app.getUrl()}`);
})();
