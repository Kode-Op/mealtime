const router = require("express").Router();
let Restaurant = require("../models/restaurant_model");

router.route("/").get((req, res) => {
  Restaurant.find()
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);
  const description = req.body.description;
  const minorder = Number(req.body.price);
  const tag = req.body.tag;
  const menuitem = req.body.menuitem;
  const order = req.body.order;
  const location = req.body.location;
  const review = req.body.review;
  const hoursofoperation = req.body.hoursofoperation;

  const newItem = new Restaurant({
    name,
    price,
    rating,
    description,
    minorder,
    tag,
    menuitem,
    order,
    location,
    review,
    hoursofoperation
  });

  newItem
    .save()
    .then(() => res.json("Restaurant added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
