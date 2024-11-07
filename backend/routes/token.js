const express = require('express');
const jwt = require('jsonwebtoken');
const { refreshTokens } = require('../utils/tokenUtils');
const router = express.Router();

// Token Refresh Route
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err || refreshTokens.get(decoded.id) !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.json({ accessToken: newAccessToken });
  });
});

module.exports = router;