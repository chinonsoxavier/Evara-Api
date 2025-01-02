const { CreateProduct } = require("../controllers/productController");
const { verify, protected } = require("../services/jwt/jwtServices");
const router = require("express").Router();
const multer = require("multer");
// const { upload } = require("../utils/multer");
const upload = multer({ dest: "uploads/" });

router.put(
  "/create-product/:id",
  upload.array("images"),
  verify,
  protected,
  CreateProduct
);

module.exports = router;
