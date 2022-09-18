import { ErrorResponseGenerator } from './response/error-response-generator';

export class MiddlewareProxy {
  public createProxy(
    targetCallback: <TRequest, TResponse>(
      req?: TRequest,
      res?: TResponse,
      next?: () => void,
    ) => void,
    errorResponseGenerator: ErrorResponseGenerator,
  ) {
    return async <TRequest, TResponse>(
      req: TRequest,
      res: TResponse,
      next: () => void,
    ) => {
      try {
        await targetCallback(req, res, next);
      } catch (err) {
        errorResponseGenerator.next(err, res);
      }
    };
  }
}
