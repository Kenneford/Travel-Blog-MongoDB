const VerifiedUser = require("../model/verifiedUsers");

//Checks the Role of a User
const authRole = (role) => {
  const userRole = VerifiedUser.find({ userRole: role });
  return (req, res, next) => {
    if (req.VerifiedUser !== userRole.admin) {
      console.log(VerifiedUser, userRole);
      res.status(401);
      return res.send("Not Authorized");
    }
    next();
  };
};

// const authUserScope = (user, blogs) => {
//   if (user.VerifiedUser === userRole.admin)
//   return blogs;
// };

const adminCheck = () => {
  const isAdmin = VerifiedUser.find({ userRole: "admin" });
  return isAdmin;
};

module.exports = {
  authRole,
  adminCheck,
};
