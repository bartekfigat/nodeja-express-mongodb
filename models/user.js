const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  useremail: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  username: String,
  password: String,
  authToken: { type: String, required: true },
  isAuthenticated: { type: Boolean, required: true, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
