const router = require("express").Router();
let Order = require("../models/order_model");
let User = require("../models/user_model");
let CreditCard = require("../models/creditCard_model");
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
// Required Fields: userId, restaurantId, creditCardId, menuItems[], address,
//                  custFirst, custLast, custPhone, custAddress
// Returns: Status based on successful/unsuccessful order creation
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  let custFirst = "";
  let custLast = "";
  let custPhone = "555-123-4567";
  let custAddress = "123 Main St, Anywhere USA";
  const restaurantId = req.body.restaurantId;
  const creditCardId = req.body.creditCardId;
  let lastFour = "";
  const menuItems = req.body.menuItems;
  const address = req.body.address;
  const instructions = req.body.instructions;
  const totalPaid = req.body.totalPaid;
  let prepTime = 0;

  const findFour = (id) => {
    return CreditCard.findById(id)
      .then((cc) => {
        lastFour = cc.number.slice(-4);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const findTime = (id) => {
    return MenuItem.findById(id)
      .then((item) => {
        prepTime += item.preptime;
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const findUser = (id) => {
    return User.findById(id)
      .then((user) => {
        custFirst = user.firstName;
        custLast = user.lastName;
        if (user.phone) {
          custPhone = user.phone;
        }
        if (user.address) {
          custAddress = user.address;
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const createOrder = async (_) => {
    for (let i = 0; i < menuItems.length; i++) {
      const result = await findTime(menuItems[i]);
    }

    const result1 = await findFour(creditCardId);
    const result2 = await findUser(userId);

    const newOrder = new Order({
      userId,
      custFirst,
      custLast,
      custPhone,
      custAddress,
      restaurantId,
      creditCardId,
      lastFour,
      menuItems,
      prepTime,
      address,
      instructions,
      totalPaid,
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
