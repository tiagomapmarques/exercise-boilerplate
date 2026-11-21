import { isNonNullable, nonNullableBy } from './is-non-nullable';

describe(isNonNullable, () => {
  it('narrows a nullable value to its non-nullable type', () => {
    const values: (string | null | undefined)[] = ['value'];

    expectTypeOf(values.filter(isNonNullable)).items.toEqualTypeOf<string>();
  });

  it('accepts a defined value', () => {
    expect(isNonNullable('value')).toBe(true);
  });

  it('accepts zero', () => {
    expect(isNonNullable(0)).toBe(true);
  });

  it('accepts an empty string', () => {
    expect(isNonNullable('')).toBe(true);
  });

  it('accepts an error', () => {
    expect(isNonNullable(new Error('Mock error.'))).toBe(true);
  });

  it('rejects null', () => {
    expect(isNonNullable(null)).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isNonNullable(undefined)).toBe(false);
  });
});

describe(nonNullableBy, () => {
  it('narrows the filtered key to its non-nullable type', () => {
    const items: { id: string | null }[] = [{ id: 'mock-id' }];

    const filtered = items.filter(nonNullableBy('id'));

    expectTypeOf(filtered).items.toHaveProperty('id').toEqualTypeOf<string>();
  });

  it('keeps an item whose key is defined', () => {
    expect([{ id: 'mock-id' }].filter(nonNullableBy('id'))).toEqual([
      { id: 'mock-id' },
    ]);
  });

  it('drops an item whose key is null', () => {
    expect([{ id: null }].filter(nonNullableBy('id'))).toEqual([]);
  });

  it('drops an item whose key is undefined', () => {
    expect([{ id: undefined }].filter(nonNullableBy('id'))).toEqual([]);
  });
});
