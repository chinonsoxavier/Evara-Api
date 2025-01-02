const orderModel = require("../models/ordersModel");


exports.CreateOrder = async (userId,name,status,date,orderImage) => {
    const newOrder = new orderModel({
        userId: userId,
        name: name,
        status: status,
        date: date,
        orderImage: orderImage
    });

    await newOrder.save();
}