import { IContainer, ProviderToken, Type } from '../container';
import { isType } from '../container/utils';

export class ScheduleContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error('Missing dependency schedule provider');
    }
    let test: any;

    if (this.container.has(token)) {
      test = this.container.get(token);
    } else {
      const tokenType = token as Type;
      test = new tokenType();
    }

    if (!test.execute) {
      throw new Error('Invalid schedule');
    }

    return test as T;
  }

  has(token: ProviderToken): boolean {
    if (this.container.has(token)) {
      return true;
    }

    return isType(token);
  }
}
