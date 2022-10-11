const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    passwordHash: String,
    confirmPasswordHash: String,
    profileImage: String,
    userRole: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VerifiedUser", userSchema);
