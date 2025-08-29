import { FetchError } from './fetching';

describe(FetchError, () => {
  it('extends the `Error` class', () => {
    const message = 'Custom error message';
    const error = new Error(message);
    const fetchError = new FetchError(message, 500);

    expect(fetchError).instanceOf(Error);
    expect(fetchError.message).toBe(error.message);
    expect(fetchError.name).toBe(error.name);

    expect(fetchError.stack).toEqual(expect.any(String));
    expect(fetchError.stack).toBeTruthy();
  });

  it('includes a status', () => {
    const fetchError = new FetchError('Custom error message', 500);
    expect(fetchError.status).toBe(500);
  });
});
