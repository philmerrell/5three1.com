const express = require('express');
const authRoutes = require('./auth');
const tokenRoutes = require('./token');
const protectedRoutes = require('./protected');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/token', tokenRoutes);
router.use('/protected', protectedRoutes);

module.exports = router;