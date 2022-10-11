const VerifiedUser = require("../model/verifiedUsers");

const canEditBlog = (userId, blog) => {
  const authUserId = VerifiedUser.findById({ _id: userId });
  return;
};
