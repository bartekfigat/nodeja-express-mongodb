const mongoose = require("mongoose");

const coomentSchema = new mongoose.Schema({
  test: String,
  author: String
});

module.exports = mongoose.model("Comennt", coomentSchema);
