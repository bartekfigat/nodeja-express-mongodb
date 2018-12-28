const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "empty field"]
  },

  description: {
    type: String,
    required: [true, "empty field"]
  },
  images: [String],
  location: String,
  coordinates: Array,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  author_id:  String
});

module.exports = mongoose.model("Post", PostSchema);
