import { verifyToken } from "../utils/jwt.js";
import { ForbiddenError } from "../utils/AppError.js";
import * as users from "../repositories/userRepository.js";

export async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return next(new ForbiddenError());

    const token = header.split(" ")[1];
    let payload;
    try {
        payload = verifyToken(token);
    } catch {
        return next(new ForbiddenError());
    }

    try {
        const user = await users.findById(payload.id);
        if (!user) return next(new ForbiddenError());
        req.user = user;
        next();
    } catch (err) {
        // a malformed id in a valid token is effectively an invalid token,
        // but anything else (DB outage, etc.) shouldn't masquerade as one
        if (err.name === "CastError") return next(new ForbiddenError());
        next(err);
    }
}
