import { omit } from '../object.util';

describe('object.util', () => {
  describe('omit', () => {
    it('can omit excluded props and leave non-excluded alone', () => {
      expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 });
    });
  });
});
