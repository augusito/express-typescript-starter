import { join } from 'path';
import { ConfigAggregator } from '../lib/config';
import { ApplicationModule } from '../lib/application';
import { AutoloadModule } from '../lib/autoload/autoload.module';
import { EventEmitterModule } from '../lib/event-emitter/event-emitter.module';
import { SchedulerModule } from '../lib/scheduler';
import { AppModule } from '../src/app/app.module';
import { OrderModule } from '../src/order/order.module';
// import { TaskModule } from '../src/task/task.module';
import { UserModule } from '../src/user/user.module';

const aggregator = new ConfigAggregator([
  ApplicationModule.register(),
  EventEmitterModule.register(),
  SchedulerModule.register(),
  AppModule.register(),
  OrderModule.register(),
  // TaskModule.register(),
  UserModule.register(),
  AutoloadModule.register(
    join(__dirname, 'autoload/{{,*.}global,{,*.}local}.+(j|t)s'),
  ),
]);

const config = aggregator.getMergedConfig();

export { config };
