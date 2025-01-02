const orderServices = require("../services/ordersServices");

exports.CreateOrder = async (req, res) => {
      const orderImageFileName = req?.file?.filename;
      const orderImageFileUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${orderImageFileName}`;
    const userId = req.params.id;
    const orderName = req.body.orderName;
    const orderStatus = "Processing";
    const orderDate = Date.now();

    try {

        if (!userId) {
            return res.status(401).json("Cannot place new order! user id not found!");
        }
       else if (userId != req.user.id) {
            return res.status(401).json("Cannot place new order! orders can only be created with your account ")
        }
        else {
            await orderServices.CreateOrder(
              userId,
              orderName,
              orderStatus,
              orderDate,
              orderImageFileUrl
            );
            return res.status(200).json("your order has been placed!")
        }
    } catch (error) {
        
    }
}