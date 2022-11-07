const { Router } = require('express');
const passport = require('passport');
const log = require('debug')('app:authRoutes');
const { sign } = require('jsonwebtoken');

const { signup, login } = require('../controllers/authController');

module.exports = function authRoutes() {
  const authRouter = Router();
  authRouter
    .route('/signup')
    .get((req, res) => {
      if (req.isAuthenticated()) {
        const userinfo = {
          _id: req.user._id,
          email: req.user.email,
          last_name: req.user.last_name,
          first_name: req.user.first_name,
        };

        const token = sign(userinfo, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return res.redirect(
          `/api/authors/${req.user._id}/blogs/?blog_token=${token}`
        );
      } else {
        return res.status(200).render('signup', { user: null });
      }
    })
    .post(passport.authenticate('signup', { session: false }), signup);

  authRouter
    .route('/login')
    .get((req, res) => {
      if (req.isAuthenticated()) {
        const userinfo = {
          _id: req.user._id,
          email: req.user.email,
          last_name: req.user.last_name,
          first_name: req.user.first_name,
        };

        const token = sign(userinfo, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return res.redirect(
          `/api/authors/${req.user._id}/blogs/?blog_token=${token}`
        );
      } else {
        return res.status(200).render('login', { user: null });
      }
    })
    .post(async (req, res, next) =>
      passport.authenticate('login', (err, user, info) => {
        login(req, res, { err, user, info });
      })(req, res)
    );
  return authRouter;
};
