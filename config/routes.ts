import { UserModule } from '../src/user/user.module';
import { Application } from '../src/core/application';

export default (app: Application) => {
  // User routes
  UserModule.registerRoutes(app);
};
