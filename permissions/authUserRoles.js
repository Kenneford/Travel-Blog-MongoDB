const VerifiedUser = require("../model/verifiedUsers");

//Checks the Role of a User
const authRole = () => {
  const autUserRole = VerifiedUser.findOne({ userRole: "admin" });
  return (req, res, next) => {
    if (req.VerifiedUser.userRole !== autUserRole) {
      res.status(401);
      return res.send("Not Authorized");
    }
    next();
  };
};

const authUserScope = (user, blogs) => {
  if (user.role === userRole.admin) return blogs;
};

module.exports = {
  authRole,
};
