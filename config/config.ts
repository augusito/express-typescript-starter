import { join } from 'path';
import { ConfigAggregator } from '../lib/config';
import { ApplicationModule } from '../lib/application/application.module';
import { HttpModule } from '../lib/http/http.module';
import { AutoloadModule } from '../lib/autoload/autoload.module';
import { EventEmitterModule } from '../lib/event-emitter/event-emitter.module';
import { AppModule } from '../src/app/app.module';
import { OrderModule } from '../src/order/order.module';
import { UserModule } from '../src/user/user.module';

const aggregator = new ConfigAggregator([
  HttpModule.register(),
  ApplicationModule.register(),
  EventEmitterModule.register(),
  AppModule.register(),
  OrderModule.register(),
  UserModule.register(),
  AutoloadModule.register(
    join(__dirname, 'autoload/{{,*.}global,{,*.}local}.+(j|t)s'),
  ),
]);

const config = aggregator.getMergedConfig();

export { config };
