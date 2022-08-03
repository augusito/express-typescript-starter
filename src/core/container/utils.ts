import { Type } from './interfaces';

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}
