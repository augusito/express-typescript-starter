import { IContainer, ProviderToken, Type } from '../container';
import { isType } from '../container/utils';

export class HookContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error('Missing dependency hook provider');
    }

    let instance: any;

    if (this.container.has(token)) {
      instance = this.container.get(token);
    } else {
      const tokenType = token as Type;
      instance = new tokenType();
    }

    if (!instance.onApplicationBootstrap) {
      throw new Error('Invalid hook');
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
