import User from "../models/User.js";

export function create({ username, email, passwordHash }) {
    return User.create({ username, email, passwordHash });
}

// needs the hash back to check the password against on login
export function findByUsername(username) {
    return User.findOne({ username }).select("+passwordHash");
}

export function findByEmail(email) {
    return User.findOne({ email }).lean();
}

export function findById(id) {
    return User.findById(id).lean();
}
