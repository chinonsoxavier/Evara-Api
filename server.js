const express = require("express");
const app = express();
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cors = require("cors");
// const LocalStrategy = require("passport-local").Strategy;
var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your frontend's origin
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  session({
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/" }),
    secret: "JBXSLHBCXJSBHCS",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
    },
  })
);

const dotenv = require("dotenv");
dotenv.config();
require('./passport');
// require('./stategies/local');
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoutes");
const ordersRoutes = require("./routes/ordersRoute");
const multer = require("multer");
// const RedisStore = require("connect-redis")(session);
// const redis = require("redis");
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const forms = require("multer");
const http = require("http").Server(app);


// const redisClient = redis.createClient({
//   host: "localhost",
//   port: 6379,
//   // password:"213216"
// })
// app.set("trust proxy", 1);

app.get("/login", (req, res, next) => {
  req.session.user = "999999999";
  res.status(200).json("logged in");
});
app.get("/user", (req, res, next) => {
  console.log(req.session.user);
  res.send(req.session.user);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "File upload error",
      error: err.message,
    });
  }
  next(err);
});

// passport.use(new LocalStrategy({
//     userNameField: "email",

// }, async (email, password, done) => {
//     const userEmail = email;
//     const userPassword = password;
//     const existingUser = await userServices.getUserByEmail(userEmail);
//     const bytes = existingUser
//         ? CryptoJS.AES?.decrypt(
//             existingUser?.password,
//             process.env.CRYPTO_JS_SECRET_KEY
//         )
//         : null;
//     const originalPassword = bytes?.toString(CryptoJS.enc.Utf8);
//     try {
//         if (existingUser == null || existingUser.$isEmpty()) {
//             console.log(userEmail);
//             console.log(userPassword);
//             console.log(existingUser);
//             return done(null, false, { message: "User not found" });
//         }
//         if (originalPassword !== userPassword) {
//             return done(null, false, { message: "Incorrect password" });
//         }
//         await DeleteRefreshToken({ userId: existingUser._id });
//         const accessToken = await GenerateToken(existingUser, "access");
//         const refreshToken = await GenerateToken(existingUser, "refresh");
//         await GenerateRefreshToken(existingUser._id, refreshToken);
//         const { password, ...info } = existingUser._doc;
//         const userSession = { ...info, accessToken, refreshToken };
//         return done(null, userSession);
//     } catch (err) {
//         return done(err);
//     }
//     // const user = await
//     // if (!user) {
//     //     return done(null, false, { message: "Incorrect username" });
//     // }
//     // if (!user.validPassword(password)) {
//     //     return done(null, false, { message: "Incorrect password" });
//     // }
//     // return done(null, user);
//     // return done(null,
// }));

const baseRoute = "/api/v1/";
// const io = require("socket-io")(http);

// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
// app.use(forms().array());
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log(chalk.green("Db connection Successfully")))
  .catch((err) => console.log(chalk.red(err)));

app.get("/login", (req, res) => {
  req.session.user = { name: "user4555" };
  res.status(200).json("Logged in");
});

// User Route
app.get("/user", (req, res) => {
  console.log("Session Data: ", req.session);
  res.send(req.session.user);
});

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use(baseRoute + "order", ordersRoutes);
app.use(baseRoute + "product", productRoutes);

// io.on("connection", () => {
//     console.log("A user connected")
// })
const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(chalk.green(`Port:localhost://${port}`));
  console.log(chalk.green(`Mode:${process.env.NODE_ENV}`));
});


module.exports = app;