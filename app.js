const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
const app = new express();

const Post = require("./models/Post");
const Comment = require("./models/comment");
// Connect to mongoDB
const db =
  "mongodb://my_app:222465bartek@ds119692.mlab.com:19692/my_express_app";
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch(err => {
    console.log(err);
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

//function that searches for only one object
// Post.find({}, { title: 1, _id: 1 }, (err, titles) => {})
//   .then(titles => {
//     console.log(titles);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const momentData = moment().format("MMM Do YY");

//Set landing page
app.get("/", (req, res) => {
  res.render("landingPage");
});

// Set about page
app.get("/about", (req, res) => {
  res.render("aboutPage");
});
//Set portfolio page
app.get("/portfolio", (req, res) => {
  res.render("portfolioPage");
});
// Set blog page
app.get("/blog", (req, res) => {
  Post.find({})
    .then(allPost => {
      if (allPost) {
        res.render("blogPage", {
          Post: allPost,
          moment: moment,
          msg: "Welcome to post page"
        });
      } else {
        res.send("where is the post");
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
  res.render("new");
});

app.get("/blog/:id", (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("Comment")
    .exec((err, foundBlog) => {
      if (err || !foundBlog) {
        res.redirect("/blog");
        console.error(err);
      } else {
        Post.findByIdAndUpdate({ _id: id }, { $inc: { views: 1 } }, (e, a) => {
          console.log(`views count: ${a.views}`);
          console.log(`cretad: ${moment(a.date).fromNow()}`);
        });
        res.render("show", { post: foundBlog });
      }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
