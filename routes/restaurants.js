const router = require("express").Router();
let Restaurant = require("../models/restaurant_model");

// Format: GET /api/restaurants/
// Required Fields: none
// Returns: All info on all restaurants
router.route("/").get((req, res) => {
  Restaurant.find()
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/Restaurant._id
// Required Fields: none
// Returns: All info on a specific restaurant
router.route("/:id").get((req, res) => {
  Restaurant.findById(req.params.id)
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/byOwner/User._id
// Required Fields: none
// Returns: All info on restaurants owned by a particular owner
router.route("/byOwner/:id").get((req, res) => {
  Restaurant.find({ ownerId: req.params.id })
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/add
// Required Fields: name, price, rating, descrption, address, hours of operation, ownerId
// Returns: Status based on successful/unsuccessful restaurant creation
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);
  const description = req.body.description;
  const minorder = Number(req.body.price);
  const address = req.body.address;
  const hoursofoperation = req.body.hoursofoperation;
  const ownerId = req.body.ownerId;

  const newItem = new Restaurant({
    name,
    price,
    rating,
    description,
    minorder,
    address,
    hoursofoperation,
    ownerId
  });

  newItem
    .save()
    .then(() => res.json("Restaurant added! Id: " + newItem.id))
    .catch(err => res.status(400).json("Error: " + err));
});

// DEPRECATED - DO NOT USE (only for Insomnia use for migration, very little error checking)
// Format: POST /api/restaurants/addOwner/Restaurant._id
// Required Fields: ownerId
// Returns: Status based on successful/unsuccessful owner update
router.route("/addOwner/:id").post((req, res) => {
  restaurantId = req.params.id;
  ownerId = req.body.ownerId;
  Restaurant.findById(restaurantId)
    .then(restaurants => {
      restaurants.ownerId = ownerId;
      restaurants
        .save()
        .then(() => res.json("OwnerId updated."))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
