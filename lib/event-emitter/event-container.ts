import { IContainer, ProviderToken } from '../container';
import { isType, stringifyToken } from '../container/utils';
import { Listener } from './interfaces';
import { INVALID_EVENT, MISSING_DEPENDENCY } from './messages';
import { hasExecute, mapToClass } from './utils';

export class EventContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(MISSING_DEPENDENCY(stringifyToken(token)));
    }

    let instance = this.container.get(token);

    if (isType(instance)) {
      const metatype = mapToClass(instance);
      instance = new metatype();
    }

    if (!hasExecute(instance as Listener)) {
      throw new Error(INVALID_EVENT(stringifyToken(token)));
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
