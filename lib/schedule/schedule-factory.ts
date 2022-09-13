import { isString } from '../utils/lang.util';
import { ScheduleContainer } from './schedule-container';

export class ScheduleFactory {
  constructor(private readonly container: ScheduleContainer) {}

  public prepare(instance: any) {
    if (instance?.execute) {
      return instance;
    }

    if (!isString(instance) || instance === '') {
      throw new Error('Invalid schedule');
    }
    return this.lazy(instance);
  }

  public lazy(instance: string) {
    return this.container.get(instance);
  }
}
