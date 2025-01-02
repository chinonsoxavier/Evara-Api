// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    userName: { type: String, required: true },
    profilePic: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: Number },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User",UserSchema)