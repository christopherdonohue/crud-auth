const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const GamerSchema = mongoose.Schema(
  {
    firstName: { value: String, color: String },
    username: { value: String, color: String },
    hashPassword: String,
    posts: [{}],
    profilePicture: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gamer', GamerSchema);
