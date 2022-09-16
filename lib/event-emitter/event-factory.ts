import { isType, stringifyToken, Type } from '../container';
import { isString } from '../utils/lang.util';
import { EventContainer } from './event-container';
import { Listener } from './interfaces';
import { INVALID_EVENT } from './messages';
import { hasExecute, mapToClass } from './utils';

export class EventFactory {
  constructor(private readonly container: EventContainer) {}

  public prepare(instance: any): Listener {
    let instanceType: Listener;

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
      throw new Error(INVALID_EVENT(stringifyToken(instance)));
    }
    return this.lazy(instance);
  }

  public callable(instance: Type<any>): Listener {
    const metatype = mapToClass(instance);
    return new metatype();
  }

  public lazy(instance: string) {
    return this.container.get<Listener>(instance);
  }

  private isClass(instance: unknown): instance is Type<any> {
    const funcAsString = instance.toString();
    return /^class\s/.test(funcAsString);
  }
}
