import { LogLevel } from './log-level.interface';

export interface LoggerOptions {
  /**
   * Enabled log levels.
   */
  logLevels?: LogLevel[];
}
