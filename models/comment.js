const mongoose = require("mongoose");

<<<<<<< HEAD
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
=======
const coomentSchema = new mongoose.Schema({
  test: String,
  author: String
});

module.exports = mongoose.model("Comennt", coomentSchema);
>>>>>>> 8a7f2b26266ba509f27e53a90b06c76a5116f1da
