import { UserModule } from '../src/user/user.module';
import { Application } from '../src/core/application';
import { AppModule } from '../src/app/app.module';
import { OrderModule } from 'src/order/order.module';

export default (app: Application) => {
  // App routes
  AppModule.registerRoutes(app);
  // Order routes
  OrderModule.registerRoutes(app);
  // User routes
  UserModule.registerRoutes(app);
};
