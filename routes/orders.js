const router = require("express").Router();
let Order = require("../models/order_model");
let User = require("../models/user_model");
let CreditCard = require("../models/creditCard_model");
let MenuItem = require("../models/menuItem_model");

// Helper function to set orders to be fulfilled if prepTime has elapsed
const setDone = (o) => {
  return new Promise(function (resolve, reject) {
    Order.findById(o._id)
      .then((order) => {
        let startTime = order.createdAt;
        let endTime = new Date();
        let timePassed = (endTime - startTime) / 60000;
        if (order.isFulfilled || order.isCanceled) {
          resolve(order);
        } else if (!order.isCanceled && timePassed > order.prepTime) {
          order.isFulfilled = true;
          order
            .save()
            .then(() => {
              Order.findById(o._id)
                .then((orderNew) => {
                  resolve(orderNew);
                })
                .catch((err) => console.log("Error: " + err));
            })
            .catch((err) => console.log("Error: " + err));
        } else {
          resolve(order);
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
};

// Helper function to iterate through orders returned from a find() function and call setDone()
const processOrders = async (orders) => {
  if (orders) {
    for (let i = 0; i < orders.length; i++) {
      orders[i] = await setDone(orders[i]);
    }
  } else {
    console.log("Err: Invalid Request");
  }
};

// Format: GET /api/orders/
// Required Fields: none
// Returns: All info on all orders
router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => {
      const process = async (orders) => {
        result = await processOrders(orders);
        res.json(orders);
      };
      process(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byUser/User._id
// Required Fields: none
// Returns: All orders on a specific user
router.route("/byUser/:id").get((req, res) => {
  Order.find({ userId: req.params.id })
    .then((orders) => {
      const process = async (orders) => {
        result = await processOrders(orders);
        res.json(orders);
      };
      process(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byRestaurant/Resturant._id
// Required Fields: none
// Returns: All orders on a specific resturant
router.route("/byRestaurant/:id").get((req, res) => {
  Order.find({ restaurantId: req.params.id })
    .then((orders) => {
      const process = async (orders) => {
        result = await processOrders(orders);
        res.json(orders);
      };
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/orders/add
// Required Fields: userId, restaurantId, creditCardId, menuItems[], address,
//                  quantity[], totalPaid
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
  const menuItemIds = req.body.menuItems;
  let menuItems = [];
  const quantity = req.body.quantity;
  const address = req.body.address;
  const instructions = req.body.instructions;
  const totalPaid = req.body.totalPaid;
  let prepTime = 0;

  if (quantity.length !== menuItemIds.length) {
    return res.status(400).json("Error: menuItems and quantity mismatched.");
  }

  const findFour = (id) => {
    return CreditCard.findById(id)
      .then((cc) => {
        lastFour = cc.number.slice(-4);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const findItem = (id, amount) => {
    return MenuItem.findById(id)
      .then((item) => {
        menuItems.push(item);
        prepTime += item.preptime * amount;
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

  const placeOrder = (order) => {
    return new Promise(function (resolve, reject) {
      order
        .save()
        .then(() => resolve("Order added!"))
        .catch((err) => reject("Error: " + err));
    });
  };

  const retrieveOrder = (userid) => {
    return new Promise(function (resolve, reject) {
      Order.find({ userId: userid })
        .then((orders) => {
          resolve(orders[orders.length - 1]._id);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });
  };

  const createOrder = async (_) => {
    for (let i = 0; i < menuItemIds.length; i++) {
      const result = await findItem(menuItemIds[i], quantity[i]);
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
      quantity,
      prepTime,
      address,
      instructions,
      totalPaid,
    });

    const result3 = await placeOrder(newOrder);
    const result4 = await retrieveOrder(userId);

    response = {
      message: result3,
      id: result4,
    };

    res.json(response);
  };

  createOrder();
});

// Format: GET /api/orders/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((orders) => {
      const process = async (orders) => {
        result = await processOrders(orders);
        res.json(orders);
      };
      process(orders);
    })
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
