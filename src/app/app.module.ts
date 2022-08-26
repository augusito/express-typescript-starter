import { Application } from '../core/application';
import { IContainer } from '../core/container';
import { AppHandler } from './app.handler';
import { AppService } from './app.service';

export class AppModule {
  static register() {
    return {
      providers: [
        {
          provide: AppService.name,
          useClass: AppService,
        },
        {
          provide: AppHandler.name,
          useFactory: (container: IContainer) => {
            return new AppHandler(container.get(AppService.name));
          },
        },
      ],
    };
  }

  static registerRoutes(app: Application) {
    app.get('/', AppHandler.name);
  }
}
