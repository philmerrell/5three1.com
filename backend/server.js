require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('./config/passport');
const routes = require('./routes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize Passport
app.use(passport.initialize());

// Mount main router on /api
app.use('/api', routes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});