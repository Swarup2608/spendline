export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(message: string, statusCode: number, code: string, isOperational = true, details?: unknown) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        
        Error.captureStackTrace(this, this.constructor);
    }
}