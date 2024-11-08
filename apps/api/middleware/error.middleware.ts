import type { Context } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";
import type { StatusCode } from "@hono/hono/utils/http-status";
import { BaseError, BulkOperationError } from "@kairos/shared/types/errors";

const isProd = Deno.env.get("DENO_ENV") === "production";

interface ZodValidationIssue {
  code: string;
  expected?: string;
  received?: string;
  path: (string | number)[];
  message: string;
}

interface ValidationErrorWrapper {
  name: string;
  errors: ZodValidationIssue[];
}

function isValidationError(error: unknown): error is ValidationErrorWrapper {
  const err = error as Error;
  return (
    err?.name === "ZodError" &&
    "errors" in err &&
    Array.isArray(err.errors) &&
    err.errors.length > 0
  );
}

export const errorHandler = (err: Error, c: Context) => {
  // Handle validation errors
  if (isValidationError(err)) {
    return c.json(
      {
        error: err.errors
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
        code: "VALIDATION_ERROR",
        ...(isProd ? {} : { stack: err.stack }),
      },
      400,
    );
  }

  // Handle Hono HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        ...(isProd ? {} : { stack: err.stack }),
      },
      err.status,
    );
  }

  // Handle our custom base errors
  if (err instanceof BaseError) {
    const response = {
      error: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
      ...(isProd ? {} : { stack: err.stack }),
    };

    // For bulk operation errors, include the nested errors
    if (err instanceof BulkOperationError) {
      return c.json(
        {
          ...response,
          errors: err.errors.map((e) => ({
            error: e.message,
            code: e.code,
          })),
        },
        err.status as StatusCode,
      );
    }

    return c.json(response, err.status as StatusCode);
  }

  // Handle unexpected errors
  return c.json(
    {
      error: isProd ? "Internal Server Error" : err.message,
      ...(isProd ? {} : { stack: err.stack }),
    },
    500,
  );
};
