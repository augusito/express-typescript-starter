import { merge } from '../utils';

describe('utils', () => {
  describe('merge', () => {
    it('simple merge', () => {
      const target = { a: 1, b: 2 };
      const source = { a: 3, c: 4 };
      const result = merge(target, source);
      expect(result).toEqual(target);
      expect(target).toEqual({ a: 3, b: 2, c: 4 });
    });

    it('object merge', () => {
      const target = { a: { b: 1, c: true, d: 2 } };
      const source = { a: { b: undefined, c: false, e: 'a' } };
      const result = merge(target, source);
      expect(result).toEqual({ a: { b: undefined, c: false, d: 2, e: 'a' } });
    });

    it('array merge', () => {
      const target = { a: ['b', 'c'] };
      const source = { a: ['b', 'd'] };
      const result = merge(target, source);
      expect(result).toEqual({ a: ['b', 'c', 'b', 'd'] });
    });
  });
});
