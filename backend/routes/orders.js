const router = require('express').Router();
let Order = require('../models/order_model');

router.route('/').get((req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const userID = req.body.userID;
    const restaurantID = req.body.restaurantID;
    const deliverylocation = req.body.deliverylocation;

    const newItem = new Order({
        userID,
        restaurantID,
        deliverylocation
    });

    newItem.save()
        .then(() => res.json('Order added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;