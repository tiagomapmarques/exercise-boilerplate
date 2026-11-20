import {
  FetchError,
  frontendGeneratedFetchErrorStatus,
  toError,
} from './errors';

describe(toError, () => {
  it('hands back an error unchanged', () => {
    const error = new Error('Custom error message');

    expect(toError(error)).toBe(error);
  });

  it('wraps a rejection that is not an error at all', () => {
    expect(toError('Custom error message')).toEqual(
      new Error('Custom error message'),
    );
  });
});

describe(FetchError, () => {
  it('extends the `Error` class', () => {
    const message = 'Custom error message';
    const error = new Error(message);
    const fetchError = new FetchError(message, { status: 500 });

    expect(fetchError).toBeInstanceOf(Error);
    expect(fetchError.message).toBe(error.message);

    expect(fetchError.stack).toMatch(/.+/u);
  });

  it('sets its name to `FetchError`', () => {
    const fetchError = new FetchError('Custom error message', { status: 500 });

    expect(fetchError.name).toBe('FetchError');
  });

  it('includes a status', () => {
    const fetchError = new FetchError('Custom error message', { status: 500 });
    expect(fetchError.status).toBe(500);
  });

  it('falls back to the status standing for an error no response carried', () => {
    const fetchError = new FetchError('Custom error message');

    expect(fetchError.status).toBe(frontendGeneratedFetchErrorStatus);
  });

  it('hands back a fetch error unchanged', () => {
    const fetchError = new FetchError('Custom error message', { status: 500 });

    expect(FetchError.from(fetchError)).toBe(fetchError);
  });

  it('wraps an error, keeping its message and reason', () => {
    const cause = new Error('Custom error message');

    const fetchError = FetchError.from(cause);

    expect(fetchError.message).toBe('Custom error message');
    expect(fetchError.status).toBe(frontendGeneratedFetchErrorStatus);
    expect(fetchError.cause).toBe(cause);
  });

  it('wraps a rejection that is not an error at all', () => {
    const fetchError = FetchError.from('Custom error message');

    expect(fetchError.message).toBe('Custom error message');
    expect(fetchError.status).toBe(frontendGeneratedFetchErrorStatus);
    expect(fetchError.cause).toBe('Custom error message');
  });
});
