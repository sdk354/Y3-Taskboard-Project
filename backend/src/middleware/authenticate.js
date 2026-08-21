import { verifyToken } from "../utils/jwt.js";
import { ForbiddenError } from "../utils/AppError.js";
import * as users from "../repositories/userRepository.js";

export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return next(new ForbiddenError());

    const token = header.split(" ")[1];
    try {
        const payload = verifyToken(token);
        const user = users.getUserById(payload.id);
        if (!user) return next(new ForbiddenError());
        req.user = user;
        next();
    } catch {
        next(new ForbiddenError());
    }
}
