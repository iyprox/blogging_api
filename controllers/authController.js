const { sign } = require('jsonwebtoken');
const log = require('debug')('app:authController');

module.exports = (function controllers() {
  return {
    signup: (req, res) => {
      const userinfo = {
        _id: req.user._id,
        email: req.user.email,
        last_name: req.user.last_name,
        first_name: req.user.first_name,
      };

      const token = sign(userinfo, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.status(201).json({ loggedIn: true, profile: userinfo, token });
    },
    login: (req, res, { err, user, info }) => {
      if (err) {
        log(err);
        return res.status(500).json(err);
      }

      req.login(user, { session: true }, async (err) => {
        if (err) {
          log(err);
          return res.status(500).json(err);
        }
        const userinfo = {
          _id: req.user._id,
          email: user.email,
          last_name: user.last_name,
          first_name: user.first_name,
        };

        const token = sign(userinfo, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        return res
          .status(200)
          .json({ loggedIn: true, profile: userinfo, token });
      });
    },
  };
})();
