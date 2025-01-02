const { verify,protected } = require("../services/jwt/jwtServices");
const router = require("express").Router();
const userController = require("../controllers/userController");
const { upload } = require("../utils/multer");

router.put("/update-user", upload.single("file"), verify, protected, userController.UpdateUserDetails);
router.put("/update-user-password", verify, protected, userController.ChangeUserPassword);

module.exports = router;