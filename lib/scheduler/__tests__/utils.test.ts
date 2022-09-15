import { Type } from '../../container';
import { assignToken, mapToClass } from '../utils';

function fnScheduler() {}

describe('mapToClass', () => {
  it('should return a metatype', () => {
    const metatype = mapToClass(fnScheduler);
    expect(metatype).not.toEqual(fnScheduler);
  });

  it('should define a `execute` method', () => {
    const metatype = mapToClass(fnScheduler) as Type<any>;
    expect(new metatype().execute).toBeDefined();
  });

  it('should encapsulate a function', () => {
    const spy = jest.fn();
    const metatype = mapToClass(spy) as Type<any>;
    new metatype().execute();
    expect(spy).toHaveBeenCalled();
  });
});

describe('assignToken', () => {
  it('should define `name` property on metatype', () => {
    const AnonymousType = class {};
    assignToken(AnonymousType);
    expect(AnonymousType.name).toBeDefined();
  });

  it('should use passed token as `name`', () => {
    const AnonymousType = class {};
    const token = 'token';
    assignToken(AnonymousType, token);
    expect(AnonymousType.name).toEqual(token);
  });
});
