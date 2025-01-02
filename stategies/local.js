// const passport = require("passport");
// const User = require("../models/userModel");
// const LocalStrategy = require("passport-local").Strategy;

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email", // Adjust to match your frontend input names
//       passwordField: "password",
//     },
//      (email, password, done) => {
//         try {
//           console.log('worked')
//         // Find user in the database
//         const user =  User.findOne({ email });
//         if (!user) {
//           return done(null, false, { message: "Incorrect email." });
//         }

//         // Validate password (use bcrypt or a similar library)
//         const isMatch =  user.isValidPassword(password);
//         if (!isMatch) {
//           return done(null, false, { message: "Incorrect password." });
//         }

//         // Successfully authenticated
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );






























