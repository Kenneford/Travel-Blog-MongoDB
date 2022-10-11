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

function _makeBlogAuthor(dbVerifiedUsers) {
  return {
    id: dbVerifiedUsers._id,
    firstName: dbVerifiedUsers.firstName,
    lastName: dbVerifiedUsers.lastName,
    userName: dbVerifiedUsers.userName,
    email: dbVerifiedUsers.email,
  };
}

function _makeUserBlog(dbVerifiedUsersBlog) {
  return {
    id: dbVerifiedUsersBlog._id.toString(),
    userName: dbVerifiedUsersBlog.userName,
    title: dbVerifiedUsersBlog.title,
    richText: dbVerifiedUsersBlog.richText,
    blogImage: dbVerifiedUsersBlog.blogImage,
    // authUserId: dbVerifiedUsersBlog.VerifiedUsers._id,
  };
}

const createBlog = ({ userName, title, richText, blogImage }) => {
  const userBlog = VerifiedUsersBlog.create({
    userName,
    title,
    richText,
    blogImage,
  });
  return userBlog;
};

const getUsersBlogs = async () => {
  return VerifiedUsersBlog.find({});
};

const getUserById = async (id) => {
  let author;
  try {
    author = await VerifiedUsers.findById(id);
  } catch (e) {
    console.log("Errorwhen getting author: " + e.message);
    return null;
  }
  return _makeBlogAuthor(author);
};
const getBlogByID = async (id) => {
  const userBlog = await VerifiedUsersBlog.findById(id);
  const apiBlog = _makeUserBlog(userBlog);
  const author = await getUserById(apiBlog.authUserId);
  apiBlog.author = author;
  return apiBlog;
};
const deleteBlogByID = async (id) => {
  const blogID = await VerifiedUsersBlog.deleteOne(id);
  return blogID;
};

module.exports = {
  createBlog,
  // getUsersBlogs,
  // getUsersBlogs,
  // getBlogByID,
  deleteBlogByID,
};
