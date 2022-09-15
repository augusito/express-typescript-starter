import { IContainer, ProviderToken } from '../container';
import { isType, stringifyToken } from '../container/utils';
import { INVALID_SCHEDULER, MISSING_DEPENDENCY } from './scheduler.messages';
import { hasExecute, mapToClass } from './utils';

export class SchedulerContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(MISSING_DEPENDENCY(stringifyToken(token)));
    }

    let instance: any = this.container.get(token);

    if (isType(instance)) {
      const metatype = mapToClass(instance);
      instance = new metatype();
    }

    if (!hasExecute(instance)) {
      throw new Error(INVALID_SCHEDULER(instance));
    }

    return instance as T;
  }

  has(token: ProviderToken): boolean {
    if (this.container.has(token)) {
      return true;
    }

    return false;
  }
}
