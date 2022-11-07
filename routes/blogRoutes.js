const { Router } = require('express');
const passport = require('passport');

const {
  getAllPublishedBlogs,
  postNewBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const blogRoutes = () => {
  const blogRouter = Router();

  blogRouter
    .route('/')
    .get(getAllPublishedBlogs)
    .post(passport.authenticate('jwt', { session: false }), postNewBlog);
  blogRouter
    .route('/:blogId')
    .get(getSingleBlog)
    .patch(passport.authenticate('jwt', { session: false }), updateBlog)
    .delete(passport.authenticate('jwt', { session: false }), deleteBlog);

  return blogRouter;
};

module.exports = blogRoutes;
