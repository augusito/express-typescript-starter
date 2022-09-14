import { IContainer, ProviderToken, Type } from '../container';
import { isType, stringifyToken } from '../container/utils';
import { INVALID_SCHEDULER, MISSING_DEPENDENCY } from './schedule.messages';

export class ScheduleContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(MISSING_DEPENDENCY(stringifyToken(token)));
    }

    let instance: any;

    if (this.container.has(token)) {
      instance = this.container.get(token);
    } else {
      const tokenType = token as Type;
      instance = new tokenType();
    }

    if (!instance.execute) {
      throw new Error(INVALID_SCHEDULER(instance));
    }

    return instance as T;
  }

  has(token: ProviderToken): boolean {
    if (this.container.has(token)) {
      return true;
    }

    return isType(token);
  }
}
