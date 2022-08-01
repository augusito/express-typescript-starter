export interface Log {
  /**
   * Logs an error with error log level.
   *
   * @param message log this message
   * @param options optional parameters
   */
  error(message: any, ...options: any[]): any;

  /**
   * Logs a message with warn log level.
   *
   * @param message log this message
   * @param options optional parameters
   */
  warn(message: any, ...options: any[]): any;

  /**
   * Logs a message with info log level.
   *
   * @param message log this message
   * @param options optional parameters
   */
  info(message: any, ...options: any[]): any;

  /**
   * Logs a message with verbose log level.
   *
   * @param message log this message
   * @param options optional parameters
   */
  verbose(message: any, ...options: any[]): any;

  /**
   * Logs a message with debug log level.
   *
   * @param message log this message
   * @param options optional parameters
   */
  debug(message: any, ...options: any[]): any;
}
