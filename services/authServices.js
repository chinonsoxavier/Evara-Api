const RefreshToken = require("../models/refreshTokenModel");
const User = require("../models/userModel");
const { refreshVerificationToken } = require("./jwt/jwtServices");
// module.exports = {
exports.createUser = async (newUser) => {
  const user = new User({
    userName: newUser.userName,
    email: newUser.email,
    password: newUser.password,
    profilePic: newUser.profilePic,
  });
  await user.save();
  return user;
};

exports.verifyUser = async (user) => {
  console.log(user.email);

  const verifiedUser = await User.findOneAndUpdate(
    { email: user.email, userName: user.userName },
    {
      isVerified: true,
    },
    { new: true }
  );
  return verifiedUser;
};
