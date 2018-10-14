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
  content: {
    type: String,
    required: [true, "empty field"]
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Post", PostSchema);
