const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userBlogSchema = new Schema(
  {
    userName: String,
    title: String,
    richText: String,
    blogImage: String,
    //   created: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VerifiedUsersBlog", userBlogSchema);
