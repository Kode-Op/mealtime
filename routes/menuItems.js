const router = require("express").Router();
let MenuItem = require("../models/menuItem_model");

// DEPRECATED - DO NOT USE
// Format: GET /api/menuItems/
// Returns: Returns JSON packages of all menu items for all restaurants
router.route("/").get((req, res) => {
  MenuItem.find()
    .then(menuItems => res.json(menuItems))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: GET /api/menuItems/Restaurant._id
// Returns: Returns JSON packages of all menu items associated with a restaurant
router.get("/:id", function(req, res) {
  const restaurant = req.params.id;

  MenuItem.find({
    restaurantId: restaurant,
    isHidden: false
  })
    .then(MenuItem => res.json(MenuItem))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: POST /api/menuItems/add
// Required Fields: restaurantId, name, price, preptime, description, category
// Returns: Status based on successful/unsuccessful menuItem creation
router.route("/add").post((req, res) => {
  const restaurantId = req.body.restaurantId;
  const name = req.body.name;
  const price = Number(req.body.price);
  const preptime = Number(req.body.preptime);
  const description = req.body.description;
  const category = req.body.category;

  const newItem = new MenuItem({
    restaurantId,
    name,
    price,
    preptime,
    description,
    category
  });

  newItem
    .save()
    .then(() => res.json("MenuItem added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
