import { Application } from './core/application';
import { HttpAdapter } from './core/http';
import { LogFactory } from './core/logging';

(async () => {
  const logger = LogFactory.getLog(Application.name);
  const app = new Application(new HttpAdapter(), { cors: true });
  app.getHttpAdapter().get('/', (req, res) => {
    res.send('Hello world!');
  });

  await app.listen(3000);
  logger.info(`Application started on: ${await app.getUrl()}`);
})();
