const express = require('express');
const passport = require('passport');
const router = express.Router();

// Protected Hello World Route
router.get('/hello', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Hello, World!');
});

module.exports = router;