import { BaseError } from "@shared/types/errors/base.error.ts";

export class UnauthorizedError extends BaseError {
  status = 401;
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED");
  }
}
