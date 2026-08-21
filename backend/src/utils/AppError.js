export class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

export class ValidationError extends AppError {
    constructor(errors) {
        super("Validation failed", 400);
        this.errors = errors;
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}
