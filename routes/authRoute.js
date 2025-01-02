const passport = require("passport");
const authController = require("../controllers/authController");
const { verify, protected } = require("../services/jwt/jwtServices");
const router = require("express").Router();

// module.exports = () => {
router.post("/register", authController.createUser);
router.put("/verify", verify, authController.verifyUser);
router.put(
  "/refresh-verification-token/:token",
  authController.RefreshVerificationToken
);
router.get("/login", authController.LoginUser);
router.put("/refresh-token", authController.RefreshToken);
router.put(
  "/reset-password",
  verify,
  protected,
  authController.ResetPasswordToken
);
router.get("/load-user", authController.GetUser);
router.get("/login/failure", (req, res) => {
  res.send("Failed to login");
});
router.get("/login/success",authController.LoginSuccess);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "/login",
  }),
  (req, res) => {
    if (req.user) {
      req.session.user = req.user;
      console.log("User:", req.user); // Log user data
      console.log("Session User:", req.session.user); // Log session data

      // Optionally, send user data as a response (e.g., for client-side handling)
      res.json({ user: req.user });
    } else {
      console.log("No user found in request.");
    }
    res.redirect("http://localhost:5173");
  }
);

router.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("http://localhost:5173");
      });
    });
    res.status(200).json("Logged out");
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});


// }

module.exports = router;
