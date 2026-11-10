import {z} from 'zod';

export const createExpenseSchema = z.object({
    title : z.string("Title is required").trim().min(3, "Title must be at least 3 characters long").max(120, "Title must be at most 120 characters long"),
    amount : z.number("Amount is required").positive("Amount must be greater than 0"),
    currency : z.string("Currency is required").trim().length(3, "Currency must be 3 characters long").toUpperCase(),
    description : z.string("Description is required").max(500, "Description must be at most 500 characters long").optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
