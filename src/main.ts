import { Log, LogFactory } from './core/logging';
import { color, style } from './core/ansi';

(() => {
  console.log('Hello World!'); // Display the string.
  const log: Log = LogFactory.getLog('LogFactory');

  console.log(color.black('black'));
  console.log(color.red('red'));
  console.log(color.green('green'));
  console.log(color.yellow('yellow'));
  console.log(color.blue('blue'));
  console.log(color.magenta('magenta'));
  console.log(color.cyan('cyan'));
  console.log(color.white('white'));

  console.log(color.blackBright('black bright'));
  console.log(color.redBright('red brigt'));
  console.log(color.greenBright('green brigt'));
  console.log(color.yellowBright('yellow brigt'));
  console.log(color.blueBright('blue brigt'));
  console.log(color.magentaBright('magenta brigt'));
  console.log(color.cyanBright('cyan brigt'));
  console.log(color.whiteBright('white brigt'));

  console.log(style.normal('normal'));
  console.log(style.bold('bold'));
  console.log(style.faint('faint'));
  console.log(style.italic('italic'));
  console.log(style.underline('undeline'));

  log.debug('A DEBUG Message');
  log.verbose('A VERBOSE Message');
  log.info('An INFO Message');
  log.warn('A WARN Message');
  log.error('An ERROR Message');
})();
