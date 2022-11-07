const { Router } = require('express');
const passport = require('passport');

const {
  getAuthorBlogs,
  getAuthorBlog,
} = require('../controllers/authorController');

const authorRoutes = () => {
  const authorRouter = Router();

  authorRouter
    .route('/:authorId/blogs')
    .get(passport.authenticate('jwt', { session: false }), getAuthorBlogs);

  authorRouter
    .route('/:authorId/blogs/:blogId')
    .get(passport.authenticate('jwt', { session: false }), getAuthorBlog);
  return authorRouter;
};

module.exports = authorRoutes;
