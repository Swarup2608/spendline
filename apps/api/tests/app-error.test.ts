import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AppError } from "../src/utils/app-error.js";


describe("AppError", () => {
  it("should create an application error with correct properties", () => {
    const error = new AppError(
      "Expense not found",
      404,
      "EXPENSE_NOT_FOUND",
    );

    assert.equal(error.message, "Expense not found");
    assert.equal(error.statusCode, 404);
    assert.equal(error.code, "EXPENSE_NOT_FOUND");
    assert.equal(error.name, "AppError");
    assert.equal(error.isOperational, true);
  });

  it("should support non-operational errors", () => {
    const error = new AppError(  "Unexpected failure", 500, "INTERNAL_ERROR", false );

    assert.equal(error.isOperational, false);
  });

  it("should support additional error details", () => {
    const details = [
      { field: "amount",  message: "Amount must be positive", },
    ];

    const error = new AppError(  "Validation failed", 400, "VALIDATION_ERROR", true, details);

    assert.deepEqual(error.details, details);
  });
});