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
  Post.findById(req.params.id)
    .then(post => {
      let text = req.body.text;
      let author = req.body.author;

      const allComment = {
        text: text,
        author: author
      };
      Comment.create(allComment).then(comment => {
        if (!comment) {
        } else {
          console.log(comment);
          post.comments.push(comment);
          post.save();
          res.redirect("/blog/" + post._id);
        }
      });
    })
    .catch(next);
});

module.exports = router;
