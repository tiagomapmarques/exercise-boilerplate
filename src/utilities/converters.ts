/** Wraps a value in an array, or returns it unchanged if it is already one. */
export const toArray = <Value>(value: Value | Value[]): Value[] => {
  return Array.isArray(value) ? value : [value];
};
