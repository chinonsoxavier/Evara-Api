const jwt = require("jsonwebtoken");
const RefreshToken = require("../../models/refreshTokenModel");

const generateToken = (user, type) => {
  return jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      isVerified: user.isVerified,
      role: user.isAdmin,
      id: user._id,
    },
    process.env.JWTSECRET_KEY,
    {
      expiresIn: type == "refresh" ? "7d" : "30m",
    }
  );
};

exports.decodedToken = (token) => {
  const decodedToken = jwt.decode(token, { complete: true }).payload;
  return decodedToken;
};

exports.GenerateToken = async (user, type) => {
  return generateToken(user, type);
};

exports.verify = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWTSECRET_KEY, (err, user) => {
      if (err?.name == "TokenExpiredError") {
        return res.status(401).json("Token is Expired");
      }
      if (err) {
        return res.status(403).json("Token is not valid");
      }

      // if (!user.isVerified) {
      //           return res
      //             .status(403)
      //             .json(
      //               "you are not verified"
      //             );

      // }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

exports.protected = (req, res, next) => {
  const authHeader = req.headers.token;
  console.log(authHeader);
  const userId = req.params.id || req.query.id;
  if (authHeader && userId) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTSECRET_KEY, (err, user) => {
      console.log(user.id, "user");
      console.log(userId, "userId");
      if (user.id !== userId) {
        return res.status(403).json("You cannot perform this action!");
      }
      // req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not allowed to perform this action");
  }
};

exports.GenerateRefreshToken = async (userId, token) => {
  const newRefreshToken = new RefreshToken({
    userId: userId,
    token: token,
  });
  await newRefreshToken.save();
  return newRefreshToken;
};

exports.GetRefreshToken = async (token) => {
  return RefreshToken.findOne(token);
};
exports.GetRefreshTokenByUserId = async (id) => {
  return RefreshToken.findOne({ userId: id });
};

exports.DeleteRefreshToken = async (token) => {
  return RefreshToken.findOneAndDelete(token);
};
