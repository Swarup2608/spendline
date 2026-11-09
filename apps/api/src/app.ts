import express from "express";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { logger } from "./utils/logger.js";
import { AppError } from "./utils/app-error.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware to generate and attach a unique request ID to each request
app.use(requestIdMiddleware);
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.path}`, {
        requestId: res.locals.requestId,
        method: req.method,
        path: req.path,
    });
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SpendLine API is healthy",
        requestId: res.locals.requestId,
     });
});

// Temporary route to test error handling
app.get("/test-error", (req, res, next) => {
    next(
        new AppError("This is a test error", 400, "TEST_ERROR")
    )
});

// Unknown route handler
app.use(notFoundHandler);


// Centralized error handling middleware
app.use(errorHandler);

export default app;