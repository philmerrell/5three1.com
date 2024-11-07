const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const AppleStrategy = require('passport-apple');
const { findOrCreateUser, findUserById } = require('../users');

// JWT Strategy for token-based authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      const user = findUserById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

// Apple Strategy for Sign in with Apple
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Convert newline characters in .env
      callbackURL: 'http://localhost:3000/auth/apple/callback',
      scope: ['name', 'email'],
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      // Find or create a user based on Apple profile information
      const user = await findOrCreateUser(profile);
      return done(null, user);
    }
  )
);