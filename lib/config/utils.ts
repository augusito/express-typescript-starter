import { isObject, isUndefined } from '../utils/lang.util';

export function merge(target: any, source: any): any {
  for (const key in source) {
    if (!isUndefined(source[key])) {
      let obj = target[key];
      const value = source[key];
      if (Array.isArray(value)) {
        obj = isUndefined(obj) ? [] : obj;
        target[key] = obj.concat(value);
      } else if (isObject(obj) && isObject(value)) {
        target[key] = { ...obj, ...value };
      } else {
        target[key] = value;
      }
    }
  }
  return target;
}
