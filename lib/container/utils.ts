import { Type } from './interfaces';

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export function stringifyToken(token: unknown): string {
  return typeof token !== 'string'
    ? typeof token === 'function'
      ? token.name
      : token?.toString()
    : `"${token}"`;
}
