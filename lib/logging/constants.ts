import { LogLevel } from './interfaces';

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  verbose: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export const DEFAULT_LOG_LEVELS: LogLevel[] = [
  'error',
  'warn',
  'info',
  'verbose',
  'debug',
];
