const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const GamerSchema = mongoose.Schema(
  {
    firstName: String,
    username: String,
    hashPassword: String,
    posts: [{}],
    profilePicture: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gamer", GamerSchema);
