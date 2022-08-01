import { Log, LogFactory } from './core/logging';

(() => {
  console.log('Hello World!'); // Display the string.
  const log: Log = LogFactory.getLog('LogFactory');

  log.debug('A DEBUG Message');
  log.verbose('A VERBOSE Message');
  log.info('An INFO Message');
  log.warn('A WARN Message');
  log.error('An ERROR Message');
})();
