import { ConfigAggregator } from '../config-aggregator';
import barModule from './fixtures/bar.module';
import fooModule from './fixtures/foo.module';

describe('utils', () => {
  describe('merge', () => {
    it('marge configs', () => {
      const aggregator = new ConfigAggregator([fooModule, barModule]);
      const config = aggregator.getMergedConfig();

      expect(config).toEqual({ foo: 'bar', bar: 'bat' });
    });
  });
});
