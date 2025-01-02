const { CreateProduct } = require("../services/productServices");

exports.CreateProduct = async (req, res) => {
  const userID = req.params.id;
  const body = req.body;
  const productImageFileName = req?.file?.filename;
  const productImageFileUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${productImageFileName}`;
  console.log(req.files);
  const newProduct = {
    productName: req.body.productName,
    productDesc: req.body.desc,
    brand: req.body.brand,
    warranty: req.body.warranty,
    deliveryMethod: req.body.deliveryMethod,
    cashBack: req.body.cashBack,
    tags: req.body.tags,
    discount: req.body.tags,
    price: req.body.price,
    variant: req.body.variants.map((variant) => ({
      size: variant.size,
      stock: variant.stock,
      colors: variant.colors,
      image: req.files
        .filter((file) => file.fieldname == `images-${variant.index}`)
        .map(
          (file) =>
            `${req.protocol}://${req.get(
              "host"
            )}/uploads/${file.filename}`
        ),
    })),
    //   [req.body.variant],
  };

  try {
    console.log(req.body, "variant");
    if (!req.user.isAdmin || !req.user.isSeller) {
      return res.status(403).json("you are not allowed to create product");
    } else if (userID != req.user.id) {
      return res
        .status(403)
        .json(
          "Cannot create new product! product can only be created with your account!"
        );
    } else {
    await CreateProduct(newProduct);
    console.log("works");
    res.status(200).json("product created successfully");
    // console.log(req.file.fieldname);
    }
  } catch (error) {
    console.log(error);
    res.status(403).json(error);
  }
};
