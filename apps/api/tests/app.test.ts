
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

describe("API Integration Tests", () => {
  describe("GET /health", () => {
    it("should return a successful health response", async () => {
      const response = await request(app)
        .get("/health");

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
      assert.equal(
        response.body.message,
        "SpendLine API is healthy",
      );
    });

    it("should return a request ID in the header and body", async () => {
      const response = await request(app)
        .get("/health");

      const requestId = response.headers["x-request-id"];

      assert.ok(requestId);
      assert.equal(response.body.requestId, requestId);
    });
  });

  describe("POST /test-expenses", () => {
    it("should accept valid expense data", async () => {
      const response = await request(app)
        .post("/test-expenses")
        .send({
          title: "Flight ticket",
          amount: 5000,
          currency: "INR",
        });

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.amount, 5000);
    });

    it("should reject invalid expense data", async () => {
      const response = await request(app)
        .post("/test-expenses")
        .send({
          title: "A",
          amount: -100,
          currency: "IN",
        });

      assert.equal(response.status, 400);
      assert.equal(
        response.body.error.code,
        "VALIDATION_ERROR",
      );
      assert.ok(response.body.error.details.length > 0);
    });
  });

  describe("Unknown routes", () => {
    it("should return 404 for an unknown endpoint", async () => {
      const response = await request(app)
        .get("/unknown");

      assert.equal(response.status, 404);
      assert.equal(
        response.body.error.code,
        "ROUTE_NOT_FOUND",
      );
    });
  });
});
