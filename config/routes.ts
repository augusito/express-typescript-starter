import { Application } from '../lib/application';
import { AppModule } from '../src/app/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { OrderModule } from '../src/order/order.module';
import { UserModule } from '../src/user/user.module';

export default (app: Application) => {
  // App routes
  AppModule.registerRoutes(app);
  // Auth module
  AuthModule.registerRoutes(app);
  // Order routes
  OrderModule.registerRoutes(app);
  // User routes
  UserModule.registerRoutes(app);
};
