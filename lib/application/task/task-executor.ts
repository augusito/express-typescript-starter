import { FailureHandler } from './failure-handler';

const DEFAULT_TEARDOWN = () => process.exit(1);

export class TaskExecutor {
  private static readonly failureHandler = new FailureHandler();

  public static execute(
    callback: () => void,
    teardown: (err: any) => void = DEFAULT_TEARDOWN,
  ) {
    try {
      callback();
    } catch (e) {
      this.failureHandler.handle(e);
      teardown(e);
    }
  }
}
