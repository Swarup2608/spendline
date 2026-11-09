type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
    requestId?: string;
    method?: string;
    path?: string;
    [key: string]: unknown;
}

function log(level: LogLevel, message: string, context: LogContext = {}): void {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
    };
    const output = JSON.stringify(logEntry);

    if (level === "error") {
        console.error(output);
        return;
    }

    if (level === "warn") {
        console.warn(output);
        return;
    }

    if (level === "debug") {
        console.debug(output);
        return;
    }

    console.log(output);
}

export const logger = {
    info: (message: string, context?: LogContext) => log("info", message, context),
    warn: (message: string, context?: LogContext) => log("warn", message, context),
    error: (message: string, context?: LogContext) => log("error", message, context),
    debug: (message: string, context?: LogContext) => log("debug", message, context),
};