import { ConfigAggregator } from '../src/core/config';
import appModule from '../src/core/application/app.module';
import httpModule from '../src/core/http/http.module';
import userModule from 'src/user/user.module';

const aggregator = new ConfigAggregator([httpModule, appModule, userModule]);

export default aggregator.getMergedConfig();
