export interface ErrorGenerator<T = any> {
  /**
   * Method to implement a custom error generator.
   *
   * @param error the class of the error being handled
   */
  next(error: T, response: any): any;
}
