const Product = require("../models/productModel");

exports.CreateProduct =async (product) => {
    const newProduct = new Product({
        SellerId:product.productSellerId,
        productName: product.productName,
        productPictures: product.productPictures,
        brand: product.brand,
        categories: product.categories,
        warranty: product.warranty,
        deliveryMethod: product.deliveryMethod,
        cashBack: product.cashBack,
        tags: product.tags,
        discount: product.discount,
        price:product.price,
        variant:product.variant
    });

    await newProduct.save();
}