import { IContainer } from '../container';
import { HttpAdapter } from '../http';
import { Application } from './application';
import { MiddlewareFactory } from './middleware-factory';

export default {
  providers: [
    {
      provide: MiddlewareFactory.name,
      useFactory: (container: IContainer) => {
        return new MiddlewareFactory();
      },
    },
    {
      provide: Application.name,
      useFactory: (container: IContainer) => {
        return new Application(
          container.get(HttpAdapter.name),
          container.get(MiddlewareFactory.name),
        );
      },
    },
  ],
};
