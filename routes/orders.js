const router = require("express").Router();
let Order = require("../models/order_model");
let MenuItem = require("../models/menuItem_model");

// Format: GET /api/orders/
// Required Fields: none
// Returns: All info on all orders
router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byUser/User._id
// Required Fields: none
// Returns: All orders on a specific user
router.route("/byUser/:id").get((req, res) => {
  Order.find({ userId: req.params.id })
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byRestaurant/Resturant._id
// Required Fields: none
// Returns: All orders on a specific resturant
router.route("/byRestaurant/:id").get((req, res) => {
  Order.find({ restaurantId: req.params.id })
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/orders/add
// Required Fields: userId, restaurantId, creditCardId, menuItems[], address
// Returns: Status based on successful/unsuccessful order creation
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const restaurantId = req.body.restaurantId;
  const creditCardId = req.body.creditCardId;
  const menuItems = req.body.menuItems;
  const address = req.body.address;
  let prepTime = 0;

  const findTime = (id) => {
    return MenuItem.findById(id)
      .then((item) => {
        prepTime += item.preptime;
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const createOrder = async (_) => {
    for (let i = 0; i < menuItems.length; i++) {
      const result = await findTime(menuItems[i]);
    }

    const newOrder = new Order({
      userId,
      restaurantId,
      creditCardId,
      menuItems,
      prepTime,
      address,
    });

    //this.setTimeOut(newItem.orderDone(), 60000 * prepTime);

    newOrder
      .save()
      .then(() => res.json("Order added!"))
      .catch((err) => res.status(400).json("Error: " + err));
  };

  createOrder();
});

// Format: GET /api/orders/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/cancel/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/cancel/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((orders) => {
      orders.isCanceled = true;
      orders
        .save()
        .then(() => res.json("Order Cancelled."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
