import { IContainer, ProviderToken, Type } from '../container';
import { isType } from '../container/utils';
import { LogFactory } from '../logging';

export class EventContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error('Missing dependency event provider');
    }
    let test: any;

    if (this.container.has(token)) {
      test = this.container.get(token);
    } else {
      const tokenType = token as Type;
      test = new tokenType();
    }

    if (!test.execute) {
      throw new Error('Invalid event');
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
