const bcrypt = require('bcrypt');

// Mock users database
const users = [
  { id: 1, username: 'testuser', password: bcrypt.hashSync('password', 10) },
];

// Find or create a user based on profile (for Apple login)
async function findOrCreateUser(profile) {
  let user = users.find((u) => u.username === profile.id);
  if (!user) {
    user = { id: users.length + 1, username: profile.id, password: null };
    users.push(user);
  }
  return user;
}

// Find user by username
function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

// Validate password
function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

// Find user by ID (for JWT verification)
function findUserById(id) {
  return users.find((user) => user.id === id);
}

module.exports = { findUserByUsername, validatePassword, findUserById, findOrCreateUser };
