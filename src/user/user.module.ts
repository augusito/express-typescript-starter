import { IContainer } from 'src/core/container';
import { UserHandler } from './user.handler';
import { UserService } from './user.service';

export default {
  providers: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
    {
      provide: UserHandler.name,
      useFactory: (container: IContainer) => {
        return new UserHandler(container.get(UserService.name));
      },
    },
  ],
};
