import { v4 } from 'uuid';
import { isFunction } from '../utils/lang.util';
import { Type } from '../container';
import { Scheduler } from './interfaces/scheduler.interface';

export const mapToClass = <T extends Function | Type<any>>(
  instance: T,
): Type<any> => {
  return assignToken(
    class {
      execute = (...params: unknown[]) => {
        return (instance as Function)(...params);
      };
    },
  );
};

export function assignToken(metatype: Type<any>, token = v4()): Type<any> {
  Object.defineProperty(metatype, 'name', { value: token });
  return metatype;
}

export function hasExecute(instance: unknown): instance is Scheduler {
  return isFunction((instance as Scheduler).execute);
}
