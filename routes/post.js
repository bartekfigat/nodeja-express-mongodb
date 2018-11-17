require("dotenv").config({ path: ".env" });
const express = require("express");
const router = express.Router({ mergeParams: true });
const moment = require("moment");
const Post = require("../models/Post");
const multer = require("multer");
const cloudinary = require("cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken: process.env.map_Box_Token
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

router.get("/blog", (req, res, next) => {
  Post.find({})
    .limit(10)
    .skip(0)
    .then(allPost => {
      if (allPost) {
        res.render("blog/index", {
          Post: allPost,
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

router.get("/api/blog", (req, res, next) => {
  const page = req.query.page;
  const limit = 10;
  const skip = (page - 1) * limit;
  Post.find({})
    .limit(limit)
    .skip(skip)
    .then(allPost => {
      console.log(allPost);
      res.render("blog/posts", {
        Post: allPost,
        moment: moment
      });
    });
});

router.post("/blog", isLoggedIn, upload.any("images"), (req, res) => {
  var images = [];

  if (typeof req.files !== "undefined") {
    for (var i = 0; i < req.files.length; i++) {
      // cloudinary.uploader.image_upload_tag(imageFile, function(result) {
      cloudinary.uploader.upload(req.files[i].path, function(result) {
        images.push(result.secure_url);
        if (images.length === req.files.length) {
          createAdvert(req, res, images);
          return;
        }
      });
    }
  } else if (err) {
    res.redirect("/blog");
    return;
  }
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

function createAdvert(req, res, images) {
  let title = req.body.title;
  let description = req.body.description;
  let content = req.body.content;
  let location = req.body.location;

  geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1
    })
    .send()
    .then(response => {
      const match = response.body;
      req.body.coordinates = match.body.featuers[0].geometry.coordinates;
    })
    .catch(err => {
      console.log(err.message);
    });

  const newPost = {
    title: title,
    description: description,
    content: content,
    images: images,
    geocodingClient: geocodingClient
  };

  Post.create(newPost)
    .then(newCreatedPost => {
      if (newCreatedPost) {
        res.redirect("/blog");
        console.log(newPost.coordinates);
      } else {
        res.send("where is the post");
      }
    })
    .catch(err => {
      req.flash("error", err.message);
      res.redirect("/blog/new");
      console.error(err.message);
    });
}

module.exports = router;
