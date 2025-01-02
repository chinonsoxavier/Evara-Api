const User = require("../models/userModel");

exports.getUserByEmail = async (userEmail) => {
  const user = User.findOne({ email: userEmail });
  return await user;
};
exports.getUserByUserName = async (userName) => {
  const user = await User.find({ userName: userName });
  return user;
};
exports.getUserById = async (userId) => {
  const user = await User.findOne({ _id: userId });
  return user;
};
exports.getUserByRefreshToken = async (token) => {
  const user = await User.findOne({ refreshToken: token });
  return user;
};

exports.updateUserDetails = async (
  id,
  updatedUserDetails,
  fileurl,
  filename
) => {
  const existingUser = await this.getUserById(id);
  console.log(filename);
  // coneolr.log(filename);
  console.log(existingUser);
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      userName: updatedUserDetails.userName,
      profilePic: filename ? fileurl : existingUser.profilePic,
      phoneNumber: updatedUserDetails?.phoneNumber,
      password: updatedUserDetails?.password,
    }
  );

  await updatedUser.save();

  return updatedUser;
};

exports.changeUserPassword = async (id, newPassword) => {
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      password: newPassword,
    }
  );

  console.log(newPassword);
  await updatedUser.save();
  // return updatedUser;
};
