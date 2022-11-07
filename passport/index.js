const passport = require('passport');

const localStrategy = require('./strategies/localStrategy');
const jwtStrategy = require('./strategies/jwtStrategy');

const passportConfig = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  localStrategy();
  jwtStrategy();

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  });

  passport.deserializeUser((user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  });
};

module.exports = passportConfig;
