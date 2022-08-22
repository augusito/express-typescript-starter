import { Log } from './interfaces';
import { Logger } from './logger';

export class LogFactory {
  static getLog(context?: string): Log {
    return new Logger(context);
  }
}
