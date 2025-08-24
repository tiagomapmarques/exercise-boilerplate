import { FetchError } from './fetching';

describe(FetchError, () => {
  const getFirstStackLine = (error: Error) => error.stack?.split('\n')[0];
  const getStackLineCount = (error: Error) => error.stack?.split('\n').length;

  it('extends the `Error` class', () => {
    const message = 'Custom error message';
    const error = new Error(message);
    const fetchError = new FetchError(message, 500);

    expect(fetchError).instanceOf(Error);
    expect(fetchError.message).toBe(error.message);
    expect(fetchError.name).toBe(error.name);

    expect(fetchError.stack).toBeTruthy();
    expect(getStackLineCount(fetchError)).toBe(getStackLineCount(error));
    expect(getFirstStackLine(fetchError)).toBe(getFirstStackLine(error));
  });

  it('includes a status', () => {
    const fetchError = new FetchError('Custom error message', 500);
    expect(fetchError.status).toBe(500);
  });
});
