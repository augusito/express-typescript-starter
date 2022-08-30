import { ProviderToken } from '../../container';
import { HookContainer } from './hook-container';

export class HookFactory {
  private readonly instances: [];
  constructor(private readonly container: HookContainer) {}

  public prepare(instance: any) {
    if (Array.isArray(instance)) {
      return this.pipeline(...instance);
    }

    return this.lazy(instance);
  }

  public lazy(instance: ProviderToken) {
    return this.container.get(instance);
  }

  public pipeline(...instance: any[]) {
    return instance.map((obj) => this.prepare(obj));
  }
}
