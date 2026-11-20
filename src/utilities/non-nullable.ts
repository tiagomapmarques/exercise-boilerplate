/** Type guard narrowing a value away from `null` and `undefined`. */
export const nonNullable = <Value>(
  value: Value,
): value is NonNullable<Value> => {
  return value !== null && value !== undefined;
};

/** Type guard factory narrowing away items whose `key` property is `null` or `undefined`. */
export const nonNullableBy =
  <Value, Key extends keyof Value>(key: Key) =>
  (item: Value): item is Value & Record<Key, NonNullable<Value[Key]>> =>
    nonNullable(item[key]);
