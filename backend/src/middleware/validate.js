import { ValidationError } from "../utils/AppError.js";

export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return next(new ValidationError(errors));
        }
        req.body = result.data;
        next();
    };
}
