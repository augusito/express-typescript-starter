import { isString } from '../utils/lang.util';
import { EventContainer } from './event-container';

export class EventFactory {
  constructor(private readonly container: EventContainer) {}

  public prepare(instance: any) {
    if (instance?.execute) {
      return instance;
    }

    if (!isString(instance) || instance === '') {
      throw new Error('Invalid event');
    }
    return this.lazy(instance);
  }

  public lazy(instance: string) {
    return this.container.get(instance);
  }
}
