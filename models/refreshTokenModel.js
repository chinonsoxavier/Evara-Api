const mongoose = require("mongoose");
const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId },
    token:{type:String,required:true}
},{timestamps:true});

module.exports =mongoose.model("refreshToken",refreshTokenSchema);