require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const { sign } = require("jsonwebtoken");
const config = require("./config");
const database = require("./database");
const passportConfig = require("./passport");

const app = express();

database(config.mongoUri);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 60,
    },
  })
);

passportConfig(app);

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authorRoutes = require("./routes/authorRoutes");

app.get("/", (req, res) => {
  return res.status(200).render("home", { user: req.user ? req.user : null });
});

app.get("/api/new-blog", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/api/auth/login");
  } else {
    const userinfo = {
      _id: req.user._id,
      email: req.user.email,
      last_name: req.user.last_name,
      first_name: req.user.first_name,
    };

    const token = sign(userinfo, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .render("newBlog", { token, user: req.user ? req.user : null });
  }
});

app.use("/api/auth", authRoutes());
app.use("/api/blogs", blogRoutes());
app.use("/api/authors", authorRoutes());

module.exports = app.listen(config.port, () =>
  // log("Server is up on port " + config.port)
  console.log("Server is up on port " + config.port)
);
