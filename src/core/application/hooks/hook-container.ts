import {
  IContainer,
  isType,
  ProviderToken,
  stringifyToken,
  Type,
} from '../../container';

export class HookContainer implements IContainer {
  constructor(private readonly container: IContainer) {}

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(`${stringifyToken(token)} has not been registered`);
    }

    let instance: any;

    if (this.container.has(token)) {
      instance = this.container.get(token);
    } else {
      const tokenType = token as Type;
      instance = new tokenType();
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
