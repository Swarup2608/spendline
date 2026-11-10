import type { RequestHandler } from "express";
import  {z, type ZodType } from "zod";
import { AppError } from "../utils/app-error.js";


interface RequestSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}

export const validateRequest = (schemas: RequestSchemas): RequestHandler => {
    return (req, res, next) => {
        try{
            if(schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if(schemas.query) {
                schemas.query.parse(req.query);
            }

            if(schemas.params) {
                schemas.params.parse(req.params);
            }

            next();
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const details = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                next(new AppError("Validation Error", 400, "VALIDATION_ERROR",true, details));
                return;
            }
            next(error);
        }
    };
}