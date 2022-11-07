const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const log = require('debug')('app:jwtStrategy');

const jwtStrategy = () => {
  const options = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('blog_token'),
  };
  passport.use(
    new Strategy(options, (token, done) => {
      try {
        log('JWT STRATEGY: ', token);
        return done(null, token);
      } catch (err) {
        log('JWT Error: => ', err);
        return done(err);
      }
    })
  );
};

module.exports = jwtStrategy;
