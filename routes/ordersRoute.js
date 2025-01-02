const ordersController = require("../controllers/orderController");
const { verify, protected } = require("../services/jwt/jwtServices");
const { upload } = require("../utils/multer");
const router = require("express").Router();

router.post("/create", verify, protected,upload.single("file"), ordersController.CreateOrder);


module.exports = router;