const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Post", PostSchema);
