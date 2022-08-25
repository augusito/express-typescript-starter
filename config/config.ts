import { join } from 'path';
import { ConfigAggregator } from '../src/core/config';
import { AppModule } from '../src/core/application/app.module';
import { HttpModule } from '../src/core/http/http.module';
import { UserModule } from '../src/user/user.module';
import { AutoloadModule } from '../src/core/autoload/autoload.module';

const aggregator = new ConfigAggregator([
  HttpModule.register(),
  AppModule.register(),
  UserModule.register(),
  AutoloadModule.register(
    join(__dirname, 'autoload/{{,*.}global,{,*.}local}.+(j|t)s'),
  ),
]);

export default aggregator.getMergedConfig();
