const mongoose = require("mongoose");
const log = require("debug")("app:database");

module.exports = (mongooseUrl) => {
  try {
    mongoose.connect(mongooseUrl, () => {
      console.log("Connected to Mongodb successfully");
      log("Connected to Mongodb successfully");
    });
  } catch (err) {
    console.log(err);
    log(err);
  }
};
