require("dotenv").config({ path: ".env" });
const express = require("express");
const passport = require("passport");
const Post = require("../models/Post");
const User = require("../models/user");
const moment = require("moment");
const cloudinary = require("cloudinary");
const multer = require("multer");
const flash = require("express-flash");

const router = express.Router();

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
    .limit(4)
    .then(post => {
      if (post) {
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
router.get("/register", (req, res) => {
  res.render("register");
});
//sing up logic
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    useremail: req.body.useremail
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.render("register", {err: err.message});
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/blog");
    });
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



router.get("/user", isLoggedIn, (req, res) => {
  Post.find({author_id: req.user._id})
    .skip(0)
    .limit(10)
    .then(result => {
      if (result) {
        res.render("user", {
          Post: result,
          moment: moment
        });
      } else {
        return res.redirect("/");
      }
    })
    .catch(err => {
      console.error(err);
    });


});

module.exports = router;
