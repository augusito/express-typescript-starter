import { IContainer } from '../container';
import { HttpAdapter } from './http-adapter';

export class HttpModule {
  static register() {
    return {
      providers: [
        {
          provide: HttpAdapter.name,
          useFactory: (container: IContainer) => {
            return new HttpAdapter();
          },
        },
      ],
    };
  }
}
