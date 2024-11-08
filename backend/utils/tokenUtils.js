const jwt = require('jsonwebtoken');

// In-memory store for refresh tokens (use a database in production)
const refreshTokens = new Map();

function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

  // Store refresh token in memory (keyed by user ID)
  refreshTokens.set(user.id, refreshToken);

  return { accessToken, refreshToken };
}

module.exports = { generateTokens, refreshTokens };