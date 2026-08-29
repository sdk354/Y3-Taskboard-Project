import * as users from "../repositories/userRepository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { ValidationError, ForbiddenError } from "../utils/AppError.js";

export async function register({ username, email, password }) {
    const [existingUsername, existingEmail] = await Promise.all([
        users.findByUsername(username),
        users.findByEmail(email),
    ]);

    if (existingUsername) throw new ValidationError([{ field: "username", message: "Already taken" }]);
    if (existingEmail) throw new ValidationError([{ field: "email", message: "Already registered" }]);

    const passwordHash = await hashPassword(password);

    try {
        const user = await users.create({ username, email, passwordHash });
        return { id: user.id, username: user.username, email: user.email };
    } catch (err) {
        // two requests can both pass the checks above before either commits
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "username";
            throw new ValidationError([{ field, message: "Already taken" }]);
        }
        throw err;
    }
}

export async function login({ username, password }) {
    const user = await users.findByUsername(username);
    if (!user) throw new ForbiddenError();

    const match = await comparePassword(password, user.passwordHash);
    if (!match) throw new ForbiddenError();

    return signToken({ id: user.id, username: user.username });
}

export async function getCurrentUser(user) {
    return { id: user._id, username: user.username, email: user.email };
}
