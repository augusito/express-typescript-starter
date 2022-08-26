import { join } from 'path';
import { ConfigAggregator } from '../src/core/config';
import { ApplicationModule } from '../src/core/application/application.module';
import { HttpModule } from '../src/core/http/http.module';
import { UserModule } from '../src/user/user.module';
import { AutoloadModule } from '../src/core/autoload/autoload.module';
import { AppModule } from 'src/app/app.module';

const aggregator = new ConfigAggregator([
  HttpModule.register(),
  ApplicationModule.register(),
  AppModule.register(),
  UserModule.register(),
  AutoloadModule.register(
    join(__dirname, 'autoload/{{,*.}global,{,*.}local}.+(j|t)s'),
  ),
]);

const config = aggregator.getMergedConfig();

export { config };
