const express = require("express");
const passport = require("passport");
const Post = require("../models/Post");
const User = require("../models/user");
const flash = require("express-flash");

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

//root route
router.get("/", (req, res) => {
  console.log(req.user);
  Post.find({})
    .then(allTitle => {
      if (allTitle) {
        res.render("layouts/landingPage", {
          allTitle: allTitle,
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
      return res.render("register");
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

module.exports = router;
