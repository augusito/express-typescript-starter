import { IContainer } from '../container';
import { HttpAdapter } from './http-adapter';

export default {
  providers: [
    {
      provide: HttpAdapter.name,
      useFactory: (container: IContainer) => {
        return new HttpAdapter();
      },
    },
  ],
};
