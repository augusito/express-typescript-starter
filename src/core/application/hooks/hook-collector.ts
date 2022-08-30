import { isFunction, isNil } from '../../utils/lang.util';
import { HookFactory } from './hook-factory';
import { OnApplicationBootstrap, OnApplicationShutdown } from '../interfaces';

export class HookCollector {
  private readonly instances: [];
  constructor(
    private readonly factory: HookFactory,
    private readonly hooks: any[] = [],
  ) {
    this.instances = factory.prepare(hooks);
  }

  async callBootstrapHook(): Promise<any> {
    await Promise.all(this.callBootstrapOperator(this.instances));
  }

  async callShutdownHook(signal?: string): Promise<any> {
    await Promise.all(this.callShutdownOperator(this.instances, signal));
  }

  callBootstrapOperator(instances: any[]): Promise<any>[] {
    return instances
      .filter((instance: any) => !isNil(instance))
      .filter(this.hasOnAppBootstrapHook)
      .map(async (instance) =>
        (instance as any as OnApplicationBootstrap).onApplicationBootstrap(),
      );
  }

  callShutdownOperator(instances: any[], signal?: string): Promise<any>[] {
    return instances
      .filter((instance: any) => !isNil(instance))
      .filter(this.hasOnAppShutdownHook)
      .map(async (instance) =>
        (instance as any as OnApplicationShutdown).onApplicationShutdown(
          signal,
        ),
      );
  }

  hasOnAppBootstrapHook(instance: unknown): instance is OnApplicationBootstrap {
    return isFunction(
      (instance as OnApplicationBootstrap).onApplicationBootstrap,
    );
  }

  hasOnAppShutdownHook(instance: unknown): instance is OnApplicationShutdown {
    return isFunction(
      (instance as OnApplicationShutdown).onApplicationShutdown,
    );
  }
}
