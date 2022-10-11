const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const VerifiedUsers = require("../model/verifiedUsers");
const VerifiedUsersBlog = require("../model/verifiedUsersBlog");
const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/test`;
// const mongodbConnection = `mongodb+srv://Kenneford88:CodeWithKenn88.@cluster0.5p7nx7s.mongodb.net/test`;
mongoose.connect(mongodbConnection);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection failed"));

// function _makeBlogAuthor(dbVerifiedUsers) {
//   return {
//     id: dbVerifiedUsers.id,
//     firstName: dbVerifiedUsers.firstName,
//     lastName: dbVerifiedUsers.lastName,
//     userName: dbVerifiedUsers.userName,
//     email: dbVerifiedUsers.email,
//   };
// }

// function _makeUserBlog(dbVerifiedUsersBlog) {
//   return {
//     id: dbVerifiedUsersBlog.id,
//     userName: dbVerifiedUsersBlog.userName,
//     title: dbVerifiedUsersBlog.title,
//     richText: dbVerifiedUsersBlog.richText,
//     blogImage: dbVerifiedUsersBlog.blogImage,
//     authUserId: dbVerifiedUsersBlog.VerifiedUsers._id,
//   };
// }

const createBlog = ({ userName, title, richText, blogImage }) => {
  VerifiedUsersBlog.create({
    userName,
    title,
    richText,
    blogImage,
  });
};

const getUsersBlogs = async () => {
  return VerifiedUsersBlog.find({});
};

async function getUserById(id) {
  const userById = await VerifiedUsers.findById(id);
  return userById;
}
async function getBlogByID(id) {
  const userBlog = await VerifiedUsersBlog.findById(id);
  return userBlog;
}
// const updateBlog = async (id) => {
//   const blogUpdate = await VerifiedUsersBlog.findByIdAndUpdate(id);
//   return blogUpdate;
// };
const deleteBlog = async (id) => {
  const blogID = await VerifiedUsersBlog.findByIdAndDelete(id);
  return blogID;
};

module.exports = {
  createBlog,
  getUsersBlogs,
  getUserById,
  getBlogByID,
  // updateBlog,
  deleteBlog,
};
