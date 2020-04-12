const router = require('express').Router();
let Order = require('../models/order_model');

// Format: GET /api/orders/
// Required Fields: none
// Returns: All info on all orders
router.route('/').get((req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Format: GET /api/userOrders/User._id
// Required Fields: none
// Returns: All orders on a specific user
router.route('/userOrders/:id').get((req, res) => {
    Order.find({userID:req.params.id})
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const userID = req.body.userID;
    const restaurantID = req.body.restaurantID;
    const deliverylocation = req.body.deliverylocation;
    const menuItems = req.body.menuItems;
    const quantityMenuItems = req.body.quantityMenuItems;
    const cancel = req.body.cancel;

    const newItem = new Order({
        userID,
        restaurantID,
        menuItems,
        quantityMenuItems,
        deliverylocation,
        cancel
    });

    newItem.save()
        .then(() => res.json('Order added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Format: GET /api/orders/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/:id").get((req, res) => {
    Order.findById(req.params.id)
      .then((orders) => res.json(orders))
      .catch((err) => res.status(400).json("Error: " + err));
});

// Format: Post /api/orders/cancel/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/cancel/:id").post((req, res) => {
    Order.findById(req.params.id)
      .then((orders) =>{
            orders.cancel = true;
        orders
            .save()
            .then(() => res.json("Order Cancelled."))
            .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;