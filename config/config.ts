import { ConfigAggregator } from '../src/core/config';
import applicationModule from '../src/core/application/application.module';
import httpModule from '../src/core/http/http.module';

const aggregator = new ConfigAggregator([httpModule, applicationModule]);

export default aggregator.getMergedConfig();
