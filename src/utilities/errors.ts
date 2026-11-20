/** Normalizes anything thrown into an `Error`, returning an `Error` unchanged. */
export const toError = (cause: unknown) => {
  return cause instanceof Error ? cause : new Error(String(cause));
};

/** Status a fetch error carries when the frontend raised it, rather than a response. */
export const frontendGeneratedFetchErrorStatus = 418;

/** Options for constructing a `FetchError`. */
export type FetchErrorOptions = ErrorOptions & { status?: number };

/** Error class that includes the HTTP status alongside the response message. */
export class FetchError extends Error {
  /** HTTP status code of the response. */
  public readonly status: number;

  public constructor(message: string, options: FetchErrorOptions = {}) {
    const { status = frontendGeneratedFetchErrorStatus, ...causeOptions } =
      options;
    super(message, causeOptions);
    this.name = 'FetchError';
    this.status = status;
  }

  /** Normalizes anything thrown into a fetch error, returning one unchanged. */
  public static from(error: unknown) {
    if (error instanceof FetchError) {
      return error;
    }

    return new FetchError(toError(error).message, { cause: error });
  }
}
