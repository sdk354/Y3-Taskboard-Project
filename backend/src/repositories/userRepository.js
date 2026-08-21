import users from "../utils/mockUsers.js";

const numericIds = users.map(u => u.id).filter(id => typeof id === "number");
let idCounter = numericIds.length ? Math.max(...numericIds) + 1 : 1;

export function getAllUsers() {
    return users;
}

export function getUserById(id) {
    return users.find(u => u.id === id);
}

export function findByUsername(username) {
    return users.find(u => u.username === username);
}

export function create({ username, passwordHash }) {
    const user = { id: idCounter++, username, passwordHash };
    users.push(user);
    return user;
}
