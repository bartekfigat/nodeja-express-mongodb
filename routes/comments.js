const express = require("express");
const router = express.Router({ mergeParams: true });

const Post = require("../models/Post");
const Comment = require("../models/comment");
const User = require("../models/user");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

//Comments new
router.get("/new", isLoggedIn, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.render("comments/new", { post: post });
      } else {
        res.redirect("/blog");
      }
    })
    .catch(err => {
      return res.redirect("/blog");
      console.error(err);
    });
});

//Comments creat
router.post("/", isLoggedIn, (req, res, next) => {
  //lokup blog using id
  //create new comment
  //connect new comment to blog
  //redirect blog/show
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.redirect("/blog");
    } else {
      let text = req.body.text;
      Comment.create({ text: text }, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          post.comments.push(comment);
          post.save();
          console.log(comment);
          res.redirect("/blog/" + post._id);
        }
      });
    }
  });
});

module.exports = router;
