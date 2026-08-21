import * as users from "../repositories/userRepository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { ValidationError, ForbiddenError } from "../utils/AppError.js";

export async function register({ username, password }) {
    const existing = users.findByUsername(username);
    if (existing) throw new ValidationError([{ field: "username", message: "Already taken" }]);

    const passwordHash = await hashPassword(password);
    const user = users.create({ username, passwordHash });
    return { id: user.id, username: user.username };
}

export async function login({ username, password }) {
    const user = users.findByUsername(username);
    if (!user) throw new ForbiddenError();

    const match = await comparePassword(password, user.passwordHash);
    if (!match) throw new ForbiddenError();

    return signToken({ id: user.id, username: user.username });
}

export async function getCurrentUser(user) {
    return { id: user.id, username: user.username };
}
