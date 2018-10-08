require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const Post = require("./models/Post");
const Comment = require("./models/comment");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");

const app = express();

// Connect to mongoDB
const db = process.env.DB_PASSWORD || "mongodb://localhost:27017/express-test";

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch(err => {
    console.log(
      `message: ${err.message}  
       codeN:${err.codeName} 
       codeNumber:${err.code} 
       errName:${err.name}
      `
    );
  });
// Staic file
app.use(express.static("./public"));

// Body parser middleware
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(422).send({ error: err.message });
});

app.set("view engine", "ejs");

// function that searches all database
// Post.find({}, (err, posts) => {
//   console.log(posts);
// });

// Post.find({}, { title: 1, _id: 0 }, (err, user) => {})
//   .then(user => {
//     console.log(user);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// function that searches for only one object
// Post.find({}, { title: 1, _id: 0 }, (err, titles) => {})
//   .then(titles => {
//     console.log(titles);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const momentData = moment().format("MMM Do YY");

//Set landing page
app.get("/", (req, res) => {
  Post.find({})
    .then(allTitle => {
      if (allTitle) {
        res.render("layouts/landingPage", { allTitle: allTitle });
      } else {
        console.log(err);
      }
    })
    .catch(err => {
      console.error(err);
    });
});

// Set about page
app.get("/about", (req, res) => {
  res.render("layouts/aboutPage");
});
//Set portfolio page
app.get("/portfolio", (req, res) => {
  res.render("layouts/portfolioPage");
});
// Set blog page
app.get("/blog", (req, res) => {
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
      console.error(err);
    });
});

app.post("/blog", (req, res) => {
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
        console.log(newCreatedPost);
      } else {
        res.send("where is the post");
      }
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/blog/new", (req, res) => {
  res.render("blog/new");
});

app.get("/blog/:id", (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("comments")
    .exec((err, foundBlog) => {
      if (err || !foundBlog) {
        res.redirect("/blog");
        console.error(err);
      } else {
        Post.findByIdAndUpdate({ _id: id }, { $inc: { views: 1 } }, (e, a) => {
          // console.log(`views count: ${a.views}`);
          // console.log(`cretad: ${moment(a.date).fromNow()}`);
        });
        res.render("blog/show", { post: foundBlog });
      }
    });
});

app.get("/blog/:id/comments/new", (req, res) => {
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

app.post("/blog/:id/comments", (req, res, next) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
