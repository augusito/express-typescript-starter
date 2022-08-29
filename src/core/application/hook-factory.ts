import { isType } from '../container/utils';
import { LogFactory } from '../logging';
import { isString } from '../utils/lang.util';
import { HookContainer } from './hook-container';
import { OnApplicationBootstrap } from './interfaces';

export class HookFactory {
  private readonly logger = LogFactory.getLog(HookFactory.name);
  constructor(
    private readonly container: HookContainer,
    private readonly hooks: any[] = [],
  ) {}

  async callBootstrapHook(): Promise<any> {
    const instances = this.prepare(this.hooks);

    await Promise.all(this.callOperator(instances));
  }

  callOperator(instances): Promise<any>[] {
    return instances.map(async (instance) =>
      (instance as any as OnApplicationBootstrap).onApplicationBootstrap(),
    );
  }

  public prepare(instance: any) {
    if (instance?.onApplicationBootstrap) {
      return instance;
    }

    if (Array.isArray(instance)) {
      return this.pipeline(...instance);
    }

    if (!isString(instance) || instance === '') {
      throw new Error('Invalid hook');
    }

    return this.lazy(instance);
  }

  public lazy(instance: string) {
    return this.container.get(instance);
  }

  public pipeline(...instance: any[]) {
    return instance.map((obj) => this.prepare(obj));
  }
}
