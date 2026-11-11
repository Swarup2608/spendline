import express from "express";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { logger } from "./utils/logger.js";
import { AppError } from "./utils/app-error.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {validateRequest} from "./middleware/validate-request.js";
import {createExpenseSchema} from "./modules/expenses/expense.schema.js";
import {sendSuccess} from "./utils/api-response.js";
import routes from "./routes/index.js";

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

app.use(routes);

// Temporary route to test error handling
app.get("/test-error", (req, res, next) => {
    next(
        new AppError("This is a test error", 400, "TEST_ERROR")
    )
});

app.post("/test-expenses",validateRequest({body: createExpenseSchema}), (req, res) => {
    return sendSuccess(res, {
        statusCode: 201,
        message: "Expense validated successfully",
        data: req.body
    }); 
});

// Unknown route handler
app.use(notFoundHandler);


// Centralized error handling middleware
app.use(errorHandler);

export default app;