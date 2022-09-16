import { isType, stringifyToken, Type } from '../container';
import { isString } from '../utils/lang.util';
import { Scheduler } from './interfaces';
import { SchedulerContainer } from './scheduler-container';
import { INVALID_SCHEDULER } from './scheduler.messages';
import { hasExecute, mapToClass } from './utils';

export class SchedulerFactory {
  constructor(private readonly container: SchedulerContainer) {}

  public prepare(instance: any): Scheduler {
    let instanceType: Scheduler;

    if (isType(instance)) {
      if (this.isClass(instance)) {
        instanceType = new instance();
      } else {
        instanceType = this.callable(instance);
      }
    }

    if (hasExecute(instanceType)) {
      return instanceType;
    }

    if (!isString(instance) || instance === '') {
      throw new Error(INVALID_SCHEDULER(stringifyToken(instance)));
    }

    return this.lazy(instance);
  }

  public callable(instance: Type<any>): Scheduler {
    const metatype = mapToClass(instance);
    return new metatype();
  }

  public lazy(instance: string): Scheduler {
    return this.container.get<Scheduler>(instance);
  }

  private isClass(instance: unknown): instance is Type<any> {
    const funcAsString = instance.toString();
    return /^class\s/.test(funcAsString);
  }
}
