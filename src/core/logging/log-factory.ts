import { Log } from './interfaces';
import Logger from './logger';

export default class LogFactory {
  static getLog(context?: string): Log {
    return new Logger(context);
  }
}
