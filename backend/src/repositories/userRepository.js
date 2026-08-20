const users = require('../utils/mockUsers');

module.exports = {
  getAllUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id)
};