import { isType, Type } from '../container';
import { isString } from '../utils/lang.util';
import { SchedulerContainer } from './scheduler-container';
import { mapToClass } from './utils';

export class SchedulerFactory {
  constructor(private readonly container: SchedulerContainer) {}

  public prepare(instance: any) {
    if (instance?.execute) {
      return instance;
    }

    if (isType(instance)) {
      return this.callable(instance);
    }

    if (!isString(instance) || instance === '') {
      throw new Error('Invalid schedule');
    }

    return this.lazy(instance);
  }

  public callable(instance: Type<any>) {
    const metatype = mapToClass(instance);
    return new metatype();
  }

  public lazy(instance: string) {
    return this.container.get(instance);
  }
}
