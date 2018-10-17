const express = require("express");
const router = express.Router();
const moment = require("moment");

const Post = require("../models/Post");
const Comment = require("../models/comment");
const debug = require("debug")("app:error");
const db_con = require("debug")("app:db_connected");

router.get("/", (req, res) => {
  Post.find({})
    .then(allTitle => {
      if (allTitle) {
        res.render("layouts/landingPage", { allTitle: allTitle });
      } else {
        debug(err);
      }
    })
    .catch(err => {
      debug(err);
    });
});

router.get("/blog", (req, res) => {
  Post.find({})
    .then(allPost => {
      if (allPost) {
        res.render("blog/index", {
          Post: allPost,
          moment: moment,
          msg: "Welcome to post page"
        });
      } else {
        return res.redirect("/");
      }
    })
    .catch(err => {
      debug(err);
    });
});

router.post("/blog", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let content = req.body.content;

  const newPost = {
    title: title,
    description: description,
    content: content
  };

  Post.create(newPost)
    .then(newCreatedPost => {
      if (newCreatedPost) {
        res.redirect("/blog");
        db_con(newCreatedPost);
      } else {
        res.send("where is the post");
      }
    })
    .catch(err => {
      req.flash("error", err.message);
      res.redirect("/blog/new");
      debug(err.message);
    });
});

router.get("/blog/new", (req, res) => {
  res.render("blog/new");
});

router.get("/blog/:id", (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("comments")
    .exec((err, foundBlog) => {
      if (err || !foundBlog) {
        res.redirect("/blog");
        debug(err);
      } else {
        Post.findByIdAndUpdate({ _id: id }, { $inc: { views: 1 } }, (e, a) => {
          // console.log(`views count: ${a.views}`);
          // console.log(`cretad: ${moment(a.date).fromNow()}`);
        });
        res.render("blog/show", { post: foundBlog });
      }
    });
});

router.get("/blog/:id/comments/new", (req, res) => {
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
      debug(err);
    });
});

router.post("/blog/:id/comments", (req, res, next) => {
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
          db_con(comment);
          post.comments.push(comment);
          post.save();
          res.redirect("/blog/" + post._id);
        }
      });
    })
    .catch(next);
});

module.exports = router;
