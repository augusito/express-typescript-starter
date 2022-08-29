import { UserModule } from '../src/user/user.module';
import { Application } from '../src/core/application';
import { AppModule } from '../src/app/app.module';
import { OrdersModule } from 'src/order/orders.module';

export default (app: Application) => {
  // App routes
  AppModule.registerRoutes(app);
  // Order routes
  OrdersModule.registerRoutes(app);
  // User routes
  UserModule.registerRoutes(app);
};
