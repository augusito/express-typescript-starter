import { ConfigAggregator } from '../src/core/config';
import { AppModule } from '../src/core/application/app.module';
import { HttpModule } from '../src/core/http/http.module';
import { UserModule } from 'src/user/user.module';

const aggregator = new ConfigAggregator([
  HttpModule.register(),
  AppModule.register(),
  UserModule.register(),
]);

export default aggregator.getMergedConfig();
