const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function hashPassword(next) {
  const hashedPassword = await hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  return await compare(password, this.password);
};

module.exports = model('User', userSchema);
