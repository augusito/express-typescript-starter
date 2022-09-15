import { isType, stringifyToken, Type } from '../container';
import { isString } from '../utils/lang.util';
import { Scheduler } from './interfaces';
import { SchedulerContainer } from './scheduler-container';
import { INVALID_SCHEDULER } from './scheduler.messages';
import { hasExecute, isClass, mapToClass } from './utils';

export class SchedulerFactory {
  constructor(private readonly container: SchedulerContainer) {}

  public prepare(instance: any): Scheduler {
    let instanceType: Scheduler;

    if (isType(instance)) {
      if (isClass(instance)) {
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

    return this.lazy(instance) as Scheduler;
  }

  public callable(instance: Type<any>) {
    const metatype = mapToClass(instance);
    return new metatype();
  }

  public lazy(instance: string) {
    return this.container.get(instance);
  }
}
