const { updateUserDetails } = require("../services/userServices");
const CryptoJS = require("crypto-js");
const userServices = require("../services/userServices");
const chalk = require("chalk");

exports.UpdateUserDetails = async (req, res) => {
  const filename = req?.file?.filename;
  const fileurl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
  const id = req.query.id;
  const updatedUserDetails = {
    userName: req.body.userName,
    phoneNuber: req.body.phoneNuber,
  };
  console.log(req.body);
  try {
    console.log( req.body,"body");
    await updateUserDetails(id, updatedUserDetails, fileurl, filename);
    res.status(200).json("your account has been updated successfully");
    // }
  } catch (error) {
    console.log(error);

    res.status(400).json(error);
  }
};

exports.ChangeUserPassword = async (req, res) => {
  const email = req.user.email;
  const existingUser = await userServices.getUserByEmail(email);
  const oldpassword = req.body?.password;
  const newPassword = req.body.newPassword;
  const comfirmNewPassword = req.body.comfirmNewPassword;
  const userId = req.query.id;
  console.log(email);
  const bytes = CryptoJS.AES.decrypt(
    existingUser.password,
    process.env.CRYPTO_JS_SECRET_KEY
  );
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalPassword, "originalPassword");
console.log(oldpassword, "oldPassword");
  try {
    if (!oldpassword) {
      return res.status(403).json("Comfirm Current Password");
    } else if (originalPassword != oldpassword) {
      return res.status(403).json("Current Password is incorrect");
    } else if (newPassword !== comfirmNewPassword) {
      return res.status(403).json("Comfirm Password does not match ");
    }
    await userServices.changeUserPassword(userId,CryptoJS.AES.encrypt(
      newPassword,
      process.env.CRYPTO_JS_SECRET_KEY
    ).toString());

    res.status(200).json("your password has been changed!");
  } catch (error) {
    console.log(chalk.red(error));
    res.status(401).json(error);
  }
};

exports.GetUser = async (req, res) => {
  
}
