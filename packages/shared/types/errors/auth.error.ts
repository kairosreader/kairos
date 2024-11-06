import { BaseError } from "./base.error.ts";

export class UnauthorizedError extends BaseError {
  status = 401;
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED");
  }
}
