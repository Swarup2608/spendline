import type {ErrorRequestHandler} from "express";
import {AppError} from "../utils/app-error.js";
import {logger} from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (err : unknown, req, res, next) => {
    const requestId = res.locals.requestId as string | undefined;

    const isOperationalError = err instanceof AppError;

    const statusCode = isOperationalError ? err.statusCode : 500;
    const code = isOperationalError ? err.code : "INTERNAL_SERVER_ERROR";
    const message = isOperationalError ? err.message : "An unexpected error occurred.";

    logger.error(`Error occurred: ${message}`, {
        requestId,
        method: req.method,
        path: req.path,
        errorName: err instanceof Error ? err.name : "UnknownError",
        errorMessage: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        error : {
            code,
            message,
            ...(isOperationalError && err.details !== undefined ? { details: err.details } : {}),
            requestId,
        }
    });
}