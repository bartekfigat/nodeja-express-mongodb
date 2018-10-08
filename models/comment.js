const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "required field"]
  },
  author: {
    type: String,
    required: [true, "required field"]
  }
});

module.exports = mongoose.model("Comment", commentSchema);
