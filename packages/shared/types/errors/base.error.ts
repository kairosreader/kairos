export interface ErrorDetails {
  code: string;
  message: string;
  details?: unknown;
}

export abstract class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  abstract status: number;

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
