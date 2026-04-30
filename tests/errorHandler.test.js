const request = require("supertest");
const express = require("express");
const { notFoundHandler, errorHandler } = require("../src/middleware/errorHandler");
const healthRouter = require("../src/routes/health");

function createApp(middleware) {
  const app = express();
  app.use("/health", healthRouter);
  if (middleware) app.use(middleware);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe("Health Endpoint", () => {
  test("GET /health returns 200 with status ok", async () => {
    const app = createApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("404 Handler", () => {
  test("returns 404 for unknown routes", async () => {
    const app = createApp();
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("not found");
  });

  test("includes method and path in error message", async () => {
    const app = createApp();
    const res = await request(app).post("/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("POST");
    expect(res.body.error).toContain("/nonexistent");
  });
});

describe("Error Handler", () => {
  test("returns 500 for unhandled errors", async () => {
    const app = express();
    app.use((req, res, next) => {
      next(new Error("Something broke"));
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const res = await request(app).get("/trigger-error");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Something broke");
  });

  test("returns custom status code when set on error", async () => {
    const app = express();
    app.use((req, res, next) => {
      const err = new Error("Bad request");
      err.statusCode = 400;
      next(err);
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const res = await request(app).get("/bad");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bad request");
  });

  test("includes stack trace in development mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const app = express();
    app.use((req, res, next) => {
      next(new Error("Test error"));
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const res = await request(app).get("/dev-error");
    expect(res.status).toBe(500);
    expect(res.body.stack).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  test("does not include stack trace in production mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const app = express();
    app.use((req, res, next) => {
      next(new Error("Test error"));
    });
    app.use(notFoundHandler);
    app.use(errorHandler);

    const res = await request(app).get("/prod-error");
    expect(res.status).toBe(500);
    expect(res.body.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
