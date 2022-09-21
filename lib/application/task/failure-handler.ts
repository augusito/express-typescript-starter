import { LogFactory } from '../../logging';

export class FailureHandler {
  private static readonly logger = LogFactory.getLog(FailureHandler.name);

  public handle(exception: Error) {
    FailureHandler.logger.error(exception.message, exception.stack);
  }
}
