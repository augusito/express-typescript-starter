import { LogFactory } from '../../logging';

export class ErrorResponseGenerator {
  private readonly logger = LogFactory.getLog(ErrorResponseGenerator.name);

  public next(error: Error | any, response: any) {
    return this.prepareResponse(error, response);
  }

  private prepareResponse(error: Error | any, response: any) {
    const statusCode = this.getStatusCode(error);
    response = response.status(this.getStatusCode(error));
    const message = {
      statusCode: statusCode,
      message: error.message,
    };

    this.logger.error((error as Error).message, (error as Error).stack);

    return response.json(message);
  }

  private getStatusCode(error: Error | any): number {
    let status = error.statusCode;

    if (!status || status < 400 || status >= 600) {
      status = 500;
    }

    return status;
  }
}
