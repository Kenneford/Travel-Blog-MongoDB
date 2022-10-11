// require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/test`;
// const mongodbConnection = `mongodb+srv://Kenneford88:CodeWithKenn88.@cluster0.5p7nx7s.mongodb.net/test`;
mongoose.connect(mongodbConnection);

const VerifiedUser = require("../model/verifiedUsers");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection failed"));

const userSignup = ({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
  profileImage,
  userRole,
}) => {
  console.log("username", userName);
  console.log("password", password);
  const passwordHash = bcrypt.hashSync(password, 10);
  const confirmPasswordHash = bcrypt.hashSync(confirmPassword, 10);
  console.log("username", userName);
  console.log("password", password);
  VerifiedUser.create({
    firstName,
    lastName,
    userName,
    email,
    passwordHash,
    confirmPasswordHash,
    profileImage,
    userRole,
  });
};

const getRegUsers = async () => {
  return VerifiedUser.find({});
};

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

//How Users Should LogIn
const validateUser = async ({ username, password }) => {
  const user = await VerifiedUser.findOne({ username });
  console.log(user);
  let isValid = false;
  try {
    isValid = await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    return null;
  }
  if (!isValid) {
    return null;
  }
  return { token: generateAccessToken(username), username };
};
const logOutUser = async ({ username, password }) => {
  const user = await VerifiedUser.findOne({ username });
  console.log(user);
  let isValid = false;
  try {
    isValid = await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    return null;
  }
  if (!isValid) {
    return null;
  }
  return null;
  // return { token: generateAccessToken(username), username };
};

//Check validity of a User's Identity
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    token = req.cookies.access_token?.token;
  }
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

const authUserRole = async (role) => {
  const userRole = await VerifiedUser.findOne({ userRole: role });
  return userRole;
};

module.exports = {
  userSignup,
  getRegUsers,
  validateUser,
  authenticateToken,
  authUserRole,
  logOutUser,
};
