const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = {
  connectDb: () => {
      mongoose.connect(
        process.env.MONGODBURL,
        {}
      ).then(()=>console.log(chalk.green("Db connection Successfully"))).catch((err)=>console.log(chalk.red(err)));
  },
};
