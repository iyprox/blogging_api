const log = require('debug')('app:authorController');

const Blog = require('../models/Blog');

module.exports = (function controller() {
  return {
    getAuthorBlogs: async (req, res) => {
      try {
        if (req.isAuthenticated()) {
          if (req.user._id === req.params.authorId) {
            let { page = 1, limit = 4 } = req.query;

            if (typeof page === 'string') {
              page = +page;
              limit = +limit;
            }

            const startIndex = (page - 1) * limit;
            const endIndex = limit * page;

            const blogsObj = {};

            if (endIndex < (await Blog.countDocuments().exec())) {
              blogsObj.next = {
                page: page + 1,
                limit,
              };
            }

            if (startIndex > 0) {
              blogsObj.previous = {
                page: page - 1,
                limit,
              };
            }

            const queryBy = {
              authorId: req.user._id,
            };

            if (req.query.state) {
              queryBy.state = req.query.state;
            }
            blogsObj.blogLists = await Blog.find(queryBy)
              .limit(endIndex)
              .skip(startIndex);

            return res.status(200).json(blogsObj);
          } else {
            return res.status(403).json({
              message:
                'Can only view your own list of published and draft blogs',
            });
          }
        } else {
          return res.status(401).json({
            message: 'You must be authenticated to perform this operation.',
          });
        }
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
    getAuthorBlog: async (req, res) => {
      const { authorId, blogId } = req.params;
      try {
        if (authorId === req.user._id) {
          const blog = await Blog.findOne({ _id: blogId, authorId });
          if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
          }
          return res.status(200).json(blog);
        }
      } catch (err) {
        return res.status(500).json(err);
      }
    },
  };
})();
