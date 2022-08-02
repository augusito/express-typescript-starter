import { IContainer, ProviderToken } from './interfaces';

export default class Container implements IContainer {
  get<T>(token: ProviderToken): T {
    throw new Error('Method not implemented.');
  }
}
