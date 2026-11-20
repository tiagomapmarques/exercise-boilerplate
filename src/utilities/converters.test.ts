import { toArray } from './converters';

describe(toArray, () => {
  describe('the value is not an array', () => {
    it.each`
      value        | result
      ${'value'}   | ${['value']}
      ${null}      | ${[null]}
      ${undefined} | ${[undefined]}
      ${0}         | ${[0]}
      ${''}        | ${['']}
      ${[[], -1]}  | ${[[], -1]}
    `('ensures "$value" is an array', ({ value, result }) => {
      expect(toArray(value)).toEqual(result);
    });
  });

  describe('the value is already an array', () => {
    it.each`
      value
      ${['value']}
      ${[null]}
      ${[undefined]}
      ${[0]}
      ${['']}
      ${[[], -1]}
    `('returns the exact value given ($value)', ({ value }) => {
      expect(toArray(value)).toBe(value);
    });
  });
});
