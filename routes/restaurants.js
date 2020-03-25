const router = require("express").Router();
let Restaurant = require("../models/restaurant_model");

// DEPRECATED - DO NOT USE
// Format: GET /api/restaurants/
// Required Fields: none
// Returns: All info on all restaurants
router.route("/").get((req, res) => {
  Restaurant.find()
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/add
// Required Fields: name, price, rating, descrption, address, hours of operation
// Returns: Status based on successful/unsuccessful restaurant creation
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);
  const description = req.body.description;
  const minorder = Number(req.body.price);
  const address = req.body.address;
  const hoursofoperation = req.body.hoursofoperation;

  const newItem = new Restaurant({
    name,
    price,
    rating,
    description,
    minorder,
    address,
    hoursofoperation
  });

  newItem
    .save()
    .then(() => res.json("Restaurant added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
