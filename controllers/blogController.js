const log = require('debug')('app:blogController');

const Blog = require('../models/Blog');
const User = require('../models/User');

module.exports = (function () {
  return {
    getAllPublishedBlogs: async (req, res) => {
      try {
        let {
          page = 1,
          limit = 20,
          author,
          title,
          tags,
          order_by = 'created_at',
          order = 'asc',
        } = req.query;

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

        const queryBy = { state: 'published' };

        if (author) {
          queryBy.author = author;
        }
        if (title) {
          queryBy.title = title;
        }
        if (tags) {
          queryBy.tags = { $regex: tags };
        }

        const sortQuery = {};

        const sortAtributes = order_by.split(',');

        for (let sortAttribute of sortAtributes) {
          if (order === 'asc') {
            sortQuery[sortAttribute] = 1;
          }
          if (order === 'desc') {
            sortQuery[sortAttribute] = -1;
          }
        }
        const blogs = await Blog.find(queryBy)
          .sort(sortQuery)
          .limit(endIndex)
          .skip(startIndex);

        return res.status(200).json(blogs);
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
    postNewBlog: async (req, res) => {
      try {
        if (req.isAuthenticated()) {
          const { title, description, tags, body } = req.body;
          const newBlog = await Blog.create({
            title,
            description,
            author: req.user.last_name + ' ' + req.user.first_name,
            authorId: req.user._id,
            reading_time: Math.ceil(body.length / 265),
            tags,
            body,
          });
          return res.status(201).json(newBlog);
        }
        return res.status(401).json({
          message: 'You must be logged in to perform this operation.',
        });
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
    getSingleBlog: async (req, res) => {
      try {
        const { blogId } = req.params;
        let foundBlog = await Blog.findOne({
          _id: blogId,
          state: 'published',
        });
        if (!foundBlog) {
          return res.status(404).json({ message: 'Blog not found.' });
        }

        foundBlog.read_count += 1;
        await foundBlog.save();
        let authorInfo = await User.findById(foundBlog.authorId);
        authorInfo = authorInfo.toJSON();
        delete authorInfo.password;
        const blogWithAuthorInfo = foundBlog.toJSON();
        blogWithAuthorInfo.infos = {};
        blogWithAuthorInfo.infos.author = authorInfo;

        return res.status(200).json(blogWithAuthorInfo);
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
    updateBlog: async (req, res) => {
      try {
        if (req.isAuthenticated()) {
          const { blogId } = req.params;
          const blog = await Blog.findById(blogId);
          if (blog.authorId === req.user._id) {
            const updateInfo = await Blog.updateOne({ _id: blogId }, req.body);
            return res
              .status(200)
              .json({ updateInfo, message: 'Blog updated successfully.' });
          } else {
            return res
              .status(403)
              .json({ message: 'You can only update your blog.' });
          }
        } else {
          return res.status(401).json({
            message: 'You must be logged in to perform this operation.',
          });
        }
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
    deleteBlog: async (req, res) => {
      try {
        if (req.isAuthenticated()) {
          const { blogId } = req.params;
          const blog = await Blog.findById(blogId);
          if (blog.authorId === req.user._id) {
            const deleteInfo = await Blog.deleteOne({ _id: blogId });
            return res
              .status(200)
              .json({ deleteInfo, message: 'Blog Deleted successfully.' });
          } else {
            return res
              .status(403)
              .json({ message: 'You can only delete your blog.' });
          }
        } else {
          return res.status(401).json({
            message: 'You must be logged in to perform this operation',
          });
        }
      } catch (err) {
        log(err);
        return res.status(500).json(err);
      }
    },
  };
})();
