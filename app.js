//disable DEBUG--   export DEBUG=
//multi   names--   export DEBUG=app:error,app:db_connected,app:connected
//single  name--    export DEBUG=app:error

const config = require("config");
const morgan = require("morgan");
require("dotenv").config({ path: ".env" });
const debug = require("debug")("app:error");
const db_con = require("debug")("app:db_connected");
const app_con = require("debug")("app:connected");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");

const path = require("path");
const moment = require("moment");

//requring Routes
const post = require("./routes/post");
const about = require("./routes/about");
const portfolio = require("./routes/portfolio");

// Connect to mongoDB
const db = process.env.DB_PASSWOR || "mongodb://localhost:27017/express-test";

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    db_con("mongoDB connected");
  })
  .catch(err => {
    debug(
      `message: ${err.message}  
       codeN:${err.codeName} 
       codeNumber:${err.code} 
       errName:${err.name}
      `
    );
  });

// Staic file
app.use(express.static("./public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Configuration
//export NODE_ENV=development or NODE_ENV=production

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: true
  })
);

app.use(morgan("tiny"));
app.use(flash());

app.use((err, req, res, next) => {
  console.log(err);
  res.status(422).send({ error: err.message });
});

app.use(post);
app.use(about);
app.use(portfolio);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  app_con(`app running on port ${port}`);
});
