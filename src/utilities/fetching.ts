/** Error class that includes the HTTP status alongside the response message. */
export class FetchError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
