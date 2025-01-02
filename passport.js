const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/userModel"); // Adjust the path to your User model
const userServices  = require("./services/userServices");
const { DeleteRefreshToken, GenerateToken, GenerateRefreshToken } = require("./services/jwt/jwtServices");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
        const { password, ...info } = user._doc;

    done(null, info);
  } catch (err) {
    done(err, null);
  }
});

// passport.use(
//     new LocalStrategy(,function (username, password, done) {
//       console.log("started");
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );


passport.use(new LocalStrategy({
    userNameField: "email",

}, async (email, password, done) => {
    const userEmail = email;
    const userPassword = password;
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
            return done(null, false, { message: "User not found" });
        }
        if (originalPassword !== userPassword) {
            return done(null, false, { message: "Incorrect password" });
        }
        await DeleteRefreshToken({ userId: existingUser._id });
        const accessToken = await GenerateToken(existingUser, "access");
        const refreshToken = await GenerateToken(existingUser, "refresh");
        await GenerateRefreshToken(existingUser._id, refreshToken);
        const { password, ...info } = existingUser._doc;
        const userSession = { ...info, accessToken, refreshToken };
        return done(null, userSession);
    } catch (err) {
        return done(err);
    }
    // const user = await
    // if (!user) {
    //     return done(null, false, { message: "Incorrect username" });
    // }
    // if (!user.validPassword(password)) {
    //     return done(null, false, { message: "Incorrect password" });
    // }
    // return done(null, user);
    // return done(null,
}));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken, refreshToken);
      // console.log(profile.emails);
      User.findOne({ email: profile.emails[0].value })
        .then((existingUser) => {
          if (existingUser) {
            if (existingUser.password) {
              
              return done(null, existingUser);
            } else {
              existingUser.googleId = profile.id;
              existingUser
                .save()
                .then(() => done(null, existingUser))
                .catch((err) => done(err));
              return;
            }
          }
          const newUser = new User({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
            // Correctly access the email
            // Add other fields as necessary
          });
          newUser
            .save()
            .then(() => done(null, newUser))
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    }
  )
);

module.exports = passport;
