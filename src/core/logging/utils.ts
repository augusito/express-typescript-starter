import { LogLevel } from './interfaces';
import { LOG_LEVEL_VALUES } from './constants';

/**
 * Checks whether the target level is enabled.
 *
 * @param targetLevel the target level to check
 * @param logLevels the array of enabled log levels
 * @returns true if the target level is enabled
 */
export function isLogLevelEnabled(
  targetLevel: LogLevel,
  logLevels: LogLevel[] | undefined,
): boolean {
  if (!logLevels || (Array.isArray(logLevels) && logLevels?.length === 0)) {
    return false;
  }
  if (logLevels.includes(targetLevel)) {
    return true;
  }
  const highestLogLevelValue = logLevels
    .map((level) => LOG_LEVEL_VALUES[level])
    .sort((a, b) => b - a)?.[0];

  const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
  return targetLevelValue >= highestLogLevelValue;
}
