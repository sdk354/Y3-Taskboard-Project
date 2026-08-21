const users = require("../utils/mockUsers");

let idCounter = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

function getAllUsers() {
    return users;
}

function getUserById(id) {
    return users.find(u => u.id === id);
}

function findByUsername(username) {
    return users.find(u => u.username === username);
}

function create({ username, passwordHash }) {
    const user = { id: idCounter++, username, passwordHash };
    users.push(user);
    return user;
}

module.exports = {
    getAllUsers,
    getUserById,
    findByUsername,
    create,
};
