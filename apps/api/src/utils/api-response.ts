import type {Response} from "express";

interface SuccessResponseOptions<T> {
    message: string;
    data: T;
    statusCode?: number;
}

export function sendSuccess<T> (res: Response, options: SuccessResponseOptions<T>) {
    const { message, data, statusCode = 200 } = options;
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        requestId: res.locals.requestId,
    });
}