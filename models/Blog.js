const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      requred: true,
    },
    description: String,
    author: String,
    authorId: String,
    state: {
      type: String,
      default: 'draft',
      enum: ['published', 'draft'],
    },
    tags: {
      type: String,
      default: '',
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: Number,
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Blog', blogSchema);
