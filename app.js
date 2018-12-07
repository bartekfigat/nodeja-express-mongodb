//disable DEBUG--   export DEBUG=
//multi   names--   export DEBUG=app:error,app:db_connected,app:connected
//single  name--    export DEBUG=app:error

const config = require("config");
const morgan = require("morgan");
require("dotenv").config({ path: ".env" });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("express-flash");
const User = require("./models/user");
const cors = require("cors");

const path = require("path");
const moment = require("moment");

const app = express();

//requring Routes
const indexRoutes = require("./routes/index");
const postRoutes = require("./routes/post");
const commentsRoutes = require("./routes/comments");
const aboutRoutes = require("./routes/about");
const portfolioRoutes = require("./routes/portfolio");

// Connect to mongoDB
const db = process.env.DB_PASSWOR || "mongodb://localhost:27017/express-test";

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch(err => {
    console.error(
      `message: ${err.message}  
       codeN:${err.codeName} 
       codeNumber:${err.code} 
       errName:${err.name}
      `
    );
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Staic file
app.use(express.static("public"));

// Body parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// Passport Config
app.use(
  require("express-session")({
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(morgan("tiny"));
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(postRoutes);
app.use("/blog/:id/comments", commentsRoutes);
app.use(aboutRoutes);
app.use(portfolioRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
