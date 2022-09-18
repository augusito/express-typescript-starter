export interface ErrorGenerator<TError, TResponse> {
  /**
   * Method to implement a custom error generator.
   *
   * @param error the class of the error being handled
   *  @param response the in-flight `response` object
   */
  next(error: TError, response: TResponse): any;
}
