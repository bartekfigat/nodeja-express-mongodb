const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const ejs = require("ejs");
const path = require("path");
const app = new express();

const Post = require("./models/Post");
// Connect to mongoDB
const db = "mongodb://localhost/my_express_app";
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
      res.render("blogPage", { Post: allPost });
    })
    .catch(err => {
      //console.log(err);
      return res.status(400).json({ err: "Post not found" });
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

  Post.create(newPost, (err, newCreatedPost) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blog");
      console.log("================");
      console.log("new post");
      console.log(newCreatedPost);
    }
  });
});

app.get("/blog/new", (req, res) => {
  res.render("new");
});

app.get("/blog/:id", (req, res) => {
  const id = req.params.id;
  Post.findById(id, (err, foundBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { post: foundBlog });
    }
  });

  Post.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

//     (err, foundObject) => {
//       if (err) {
//         console.log(err);
//       } else {
//         if (!foundObject) {
//           res.status(404).send();
//         } else {
//           if (req.body.views) {
//             foundObject.views = req.body.views;
//           }

//           foundObject.save((err, updateObject) => {
//             if (err) {
//               console.log(err);
//               res.status(500).send();
//             } else {
//               res.send(updateObject);
//               console.log(updateObject);
//             }
//           });
//         }
//       }
//     }
//   );
// });

// app.put("/blog/:id", (req, res) => {
//   Post.findOneAndUpdate(
//     { _id: res._id },
//     { $inc: { views: 1 } },
//     { new: true },
//     (err, respose) => {
//       if (err) {
//         console.log(err);
//       } else {
//         if (!respose) {
//           res.status(404).send();
//         } else {
//           const countViews = req.body.views;
//           if (countViews) {
//             foundObject.views = countViews;
//           }
//         }
//       }
//     }
//   );
// });
