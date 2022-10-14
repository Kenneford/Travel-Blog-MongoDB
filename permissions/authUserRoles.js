const VerifiedUser = require("../model/verifiedUsers");

//Checks the Role of a User
const authRole = (role) => {
  const autUserRole = VerifiedUser.findOne({ userRole: role });
  return (req, res, next) => {
    if (req.user.role !== autUserRole) {
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
