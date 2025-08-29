/**
 * Error class that includes the status of a response as well as the message/reason.
 */
export class FetchError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
