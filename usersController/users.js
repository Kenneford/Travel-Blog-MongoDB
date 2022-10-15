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
  const newUser = VerifiedUser.create({
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
const validateUser = async ({ userName, password }) => {
  const user = await VerifiedUser.findOne({ userName });
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
  return { token: generateAccessToken(userName), userName };
};

// async function userLogin(userName, password, res) {
//   const user = await VerifiedUser.findOne({ userName }).lean();

//   if (!user) {
//     return res.status(401).send({ status: "error", error: "Invalid username" }); // 401 MEANS UNAUTHORIZED
//   }
//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (match) {
//     const roles = Object.values(user.userRoles).filter(Boolean);
//     console.log(roles, "inside login");
//     const token = jwt.sign(
//       { id: user._id, userName: user.userName, roles: roles },
//       JWT_SECRET,
//       { expiresIn: "10m" }
//     );

//     const refreshToken = jwt.sign(
//       { id: user._id, userName: user.userName },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     await VerifiedUser.findOneAndUpdate(
//       { userName },
//       { refreshToken: refreshToken }
//     );
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       sameSite: "None",
//       secure: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       status: "ok",
//       accessToken: token,
//       refreshToken: refreshToken,
//       roles: [user.userRoles],
//     });
//   } else {
//     res.sendStatus(401);
//   }
// }

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

// const authUserRole = async () => {
//   const role = await VerifiedUser.find({ userRole: "admin" });
//   return (req, res, next) => {
//     if (!role) {
//       res.status(401);
//       return res.send("Not Permitted!");
//     }
//     next();
//   };
// };

module.exports = {
  userSignup,
  // userLogin,
  getRegUsers,
  validateUser,
  authenticateToken,
  // authUserRole,
};
