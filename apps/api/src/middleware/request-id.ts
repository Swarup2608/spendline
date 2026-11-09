import {randomUUID} from "node:crypto";
import type { RequestHandler } from "express";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
    // Generate a unique request ID for each incoming request.
    const requestId = randomUUID();
    res.setHeader("X-Request-ID", requestId);
    res.locals.requestId = requestId; // Store the request ID in res.locals for later use in logging or other middleware.
    next();
}