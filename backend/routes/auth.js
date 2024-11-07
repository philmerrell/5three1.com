const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateTokens } = require('../utils/tokenUtils');
const router = express.Router();

// Apple Login Route
router.get('/apple', passport.authenticate('apple', { scope: ['name', 'email'] }));

// Apple Callback Route
router.get('/apple/callback', passport.authenticate('apple', { session: false }), (req, res) => {
  const tokens = generateTokens(req.user);
  res.json({ message: 'Logged in with Apple successfully!', ...tokens });
});

module.exports = router;