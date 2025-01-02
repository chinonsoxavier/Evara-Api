const authServices = require("../services/authServices");
const sendMail = require("../services/emails/emailService");
const userServices = require("../services/userServices");
const CryptoJS = require("crypto-js");
const ejs = require("ejs");
const passport = require("passport");
const path = require("path");
const {
  decodedToken,
  GenerateRefreshToken,
  GenerateToken,
  GetRefreshToken,
  DeleteRefreshToken,
} = require("../services/jwt/jwtServices");
const chalk = require("chalk");

// Register
exports.createUser = async (req, res) => {
  try {
    const existingUser = await userServices.getUserByEmail(req.body.email);
    console.log(existingUser);
    const userPayload = {
      email: req.body.email,
      userName: req.body.userName,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_JS_SECRET_KEY
      ).toString(),
    };
    if (existingUser == null || existingUser.$isEmpty()) {
      const newUser = await authServices.createUser(userPayload);
      const user = {
        email: newUser.email,
        userName: newUser.userName,
      };
      console.log(newUser);
      const activationToken = await GenerateToken(user, "access");
      const activationUrl = `http://localhost:8080/auth/verify/${activationToken}`;
      const data = { email: user.email, activationUrl: activationUrl };
      const htmlContent = await ejs.renderFile(
        path.join("services", "emails", "verifyEmail.ejs"),
        data
      );
      await sendMail({
        from: `Evara ${process.env.SMPT_USER}`,
        to: req.body.email,
        subject: "Activate your Evara account",
        html: htmlContent,
      });
      return res.status(200).json({
        Message: `Account created Successfully! Please check your email ${newUser.email} to verify your account`,
      });
    } else {
      return res.status(400).json("user with this email already exists");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// verify user email
exports.verifyUser = async (req, res) => {
  const user = req.user;
  try {
    authServices.verifyUser(user);
    res.status(200).json("you account has been successfully verified");
  } catch (err) {
    console.error("user verification failed");
    console.error(err);
  }
};

// refresh verification token
exports.RefreshVerificationToken = async (req, res) => {
  const token = req.params.token;
  const user = decodedToken(token);
  try {
    const newVerificationToken = await GenerateToken(user, "access");
    const activationUrl = `http://localhost:8080/auth/verify/${newVerificationToken}`;
    const data = { email: user.email, activationUrl: activationUrl };
    const htmlContent = await ejs.renderFile(
      path.join("services", "emails", "verifyEmail.ejs"),
      data
    );
    await sendMail({
      from: `Evara ${process.env.SMPT_USER}`,
      to: req.body.email,
      subject: "Activate your Evara account",
      html: htmlContent,
    });
    res
      .status(200)
      .json("A new verification token has been sent to your email!");
  } catch (error) {
    console.log(chalk.red(err));
    res.status(400).json(error);
  }
};

// login user
exports.LoginUser = async (req, res) => {
  // passport.authenticate("local", passport.authenticate("local", (err, user, info) => {
  //   console.log("works");
  // if (err) return next(err);
  // if (!user) {
  //   return res.status(401).json({ message:"info.message" });
  // }
  // // Log in the user
  // req.logIn(user, (err) => {
  //   if (err) return next(err);
  //   return res.json({ message: "Logged In", user });
  // });
  // }));
  // req.session.destroy();
  const userEmail = req.query.email;
  const userPassword = req.query.password;
  const existingUser = await userServices.getUserByEmail(userEmail);
  const bytes = existingUser
    ? CryptoJS.AES?.decrypt(
        existingUser?.password,
        process.env.CRYPTO_JS_SECRET_KEY
      )
    : null;
  const originalPassword = bytes?.toString(CryptoJS.enc.Utf8);
  try {
    if (existingUser == null || existingUser.$isEmpty()) {
      console.log(userEmail);
      console.log(userPassword);
      console.log(existingUser);
      return res.status(404).json("User not found");
    } else if (originalPassword !== userPassword) {
      return res.status(404).json("Password incorrect");
    }
    await DeleteRefreshToken({ userId: existingUser._id });
    const accessToken = await GenerateToken(existingUser, "access");
    const refreshToken = await GenerateToken(existingUser, "refresh");
    await GenerateRefreshToken(existingUser._id, refreshToken);
    const { password, ...info } = existingUser._doc;
    // req.session.user = "user2";
    console.log(req.session.user);
    console.log("req.session.user");
    // req.session.user =  "...info, accessToken, refreshToken"
    req.session.user = { ...info, accessToken, refreshToken };
    // req.user = { ...info, accessToken, refreshToken };
    // req.session.cookie.user = { ...info, accessToken, refreshToken };
    // res.cookie("userSession", "hiii", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "PRODUCTION", // Set to true in production
    //   sameSite: "Lax", // or 'None' if needed
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    // req.session.user = "us";
  //  res.redirect("http://localhost:5173");

  return res.status(200).json("Logged in Successfully");
    // console.log(req.session);
  } catch (error) {
    console.log(chalk.red(error));
    console.error(chalk.red("Failed to login user"));
    res.status(400).json("Error " + error);
  }
};

// refresh access token
exports.RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers?.token?.split(" ")[1];
    const getUserRefreshToken = await GetRefreshToken({ token: refreshToken });
    const user = req.session.user;
    console.log(user);
    console.log(req.cookies.user);
    if (!refreshToken) {
      return res.status(403).json("refresh token not found");
    } else if (getUserRefreshToken == null || getUserRefreshToken.$isEmpty()) {
      return res.status(403).json("token is invalid");
    }
    await DeleteRefreshToken({ token: refreshToken });
    res.status(200).json(user);
  } catch (error) {
    console.log(chalk.red(error));
    console.log(chalk.red("failed to refresh token"));
  }
};

// login success

exports.LoginSuccess = async (req, res) => {
  try {
    // const userId = req.cookies.userSession; // Read the cookie
    const user =  req.user;
    const userId = req.user.id;
    const updateUser = await findUserBy
    // req.session.destroy();
    console.log("req.user");
    // console.log(req.session);
    console.log(req.user);
    // console.log(userId);
    if (!user) {
      return res.send("could not find user");
    }
    // console.log(req.session.user);
    // console.log("user");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

// reset-password
exports.ResetPasswordToken = async (req, res) => {
  const token = req.params.token;
  const user = decodedToken(token);
  try {
    const resetPasswordToken = await GenerateToken(user, "access");
    const activationUrl = `http://localhost:8080/auth/reset-password/${resetPasswordToken}`;
    const data = { email: user.email, activationUrl: activationUrl };
    const htmlContent = await ejs.renderFile(
      path.join("services", "emails", "resetPasswordEmail.ejs"),
      data
    );
    await sendMail({
      from: `Evara ${process.env.SMPT_USER}`,
      to: req.body.email,
      subject: "Reset your Evara password",
      html: htmlContent,
    });
    res.status(200).json("A reset token has been sent to your email!");
  } catch (error) {
    console.log(chalk.red(err));
    res.status(400).json(error);
  }
};

exports.GetUser = async (req, res) => {
  try {
    // const userId = req.cookies.userSession; // Read the cookie
    const user = req.session.user || req.user;
    // req.session.destroy();
    const userId = user?._id;
    console.log(req.session.user);
    const updatedUser = await userServices.getUserById(userId);
    console.log("req.user", req.user);
    console.log(updatedUser);
    console.log(userId);
    // console.log(userId);
    if (!user) {
      // return res.status(200).json("User not Logged in");
      return res.send({
        data: "User not Logged in",
        status: 404,
      });
    }
    // console.log(req.session.user);
    // console.log("user");
    res.status(200).json({
      data: updatedUser,
      status: 200,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
