require("dotenv").config({ path: ".env" });
const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const User = require("../models/user");

const cloudinary = require("cloudinary");
const multer = require("multer");
const flash = require("express-flash");

const router = express.Router();

var options = {
  auth: {
    api_user: process.env.user_Sendgrid,
    api_key: process.env.api_key_Sendgrid
  }
};

var client = nodemailer.createTransport(sgTransport(options));

// Post.find(
//   {},
//   { title: 1, _id: 0 },
//   { description: 1, _id: 0 },
//   (err, titles) => {}
// )
//   .then(titles => {
//     console.log(titles);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

//  { title: 1, _id: 0 }
//root route
router.get("/", (req, res) => {
  console.log(req.user);
  Post.find({})
    .sort({ title: -1 })
    .then(post => {
      if (post) {
        console.log(post[1].title);
        res.render("layouts/landingPage", {
          post: post,
          currentUser: req.user
        });
      } else {
        console.error(err);
      }
    })
    .catch(err => {
      console.error(err);
    });
});

//AUTH ROUTS
//User Registeration Route
router.get("/register", (req, res) => {
  res.render("register");
});
//sing up logic
router.post("/register", (req, res) => {
  let username = req.body.username;
  let useremail = req.body.useremail;
  let password = req.body.password;

  const newUser = new User({
    username: _id,
    useremail: useremail,
    authToken: jwt.sign(
      {
        sub: username,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 1) //current time + 1day ahead
      },
      "my_secret_key"
    )
  });

  let email = {
    from: "Localhost, bartek_19_83@hotmail.com",
    to: `${newUser.useremail}`,
    subject: "Hello",
    text: `Hello ${
      newUser.username
    } , thank you for registering. Please click on the following to complete your activation: http://localhost:3000/activate/${
      newUser.authToken
    }`,
    html: `Hello <strong>${newUser.username}</strong>.
              Thank you for registering at localhost.com. Please click the link below to complete yor activation
              <a href='http://localhost:3000/activate/${
                newUser.authToken
              }'> http://localhost:3000/activate</a>'`
  };

  client.sendMail(email, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
      User.register(newUser, req.body.password, (err, user) => {
        if (err) {
          console.log(err);
          req.flash("error", err.message);
          return res.render("register");
        }
      });
    }
  });
  // passport.authenticate("local")(req, res, () => {
  //   res.redirect("/blog");
});

// ===================

router.put("/activate/:token", (req, res) => {
  User.findOne({ authToken: req.params.token }, (err, user) => {
    if (err || !user) {
      console.error(err);
    } else {
      const token = req.params.token;
      jwt.verify(token, secret, (err, decoded) => {
        if (err || !user) {
          console.log(err);
        } else {
          user.authToken = false;
          user.isAuthenticated = true;
          user.save(err => {
            if (err) {
              console.log(err);
            } else {
              let email = {
                from: "Localhost, bartek_19_83@hotmail.com",
                to: `${newUser.useremail}`,
                subject: "Hello Account Activated",
                text: `Hello ${
                  newUser.username
                }.Your account has benn successfully activated`,
                html: `Hello <strong>${
                  newUser.username
                }</strong>.Your account has benn successfully activated`
              };
              client.sendMail(email, function(err, info) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Message sent: " + info.response);
                }
              });
            }
          });
        }
      });
    }
  });
});
//================Login==================
router.get("/login", (req, res) => {
  res.render("login");
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blog",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//=======================================
//logout route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/blog");
});

module.exports = router;
