const router = require("express").Router();
let Restaurant = require("../models/restaurant_model");

// Format: GET /api/restaurants/
// Required Fields: none
// Returns: All info on all restaurants
router.route("/").get((req, res) => {
  Restaurant.find()
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/byTag/:tag (tag is an int in range (1,42))
// Required Fields: none
// Returns: All info on restaurants containing corresponding tag
router.route("/byTag/:tag").get((req, res) => {
  let tag = Number(req.params.tag);
  Restaurant.find({ tags: tag })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// DEPRECATED - DO NOT USE (only for Insomnia use for migration, no max length check, limited error checks)
// Format: POST /api/restaurants/addTags/:id
// Required Fields: tags[]
// Returns: List of successful/Unsuccsessful additions, prevents duplicates
router.route("/addTags/:id").post((req, res) => {
  let tagArray = req.body.tags;
  let restaurantId = req.params.id;

  Restaurant.findById(restaurantId)
    .then((restaurant) => {
      let origArray = restaurant.tags;
      let errArray = [];
      let sucArray = [];
      for (i = 0; i < tagArray.length; i++) {
        let exists = false;
        for (j = 0; j < origArray.length; j++) {
          if (tagArray[i] === origArray[j]) {
            exists = true;
          }
        }
        if (!exists) {
          // if tag isn't already in the list
          origArray.push(tagArray[i]);
          sucArray.push(tagArray[i]);
        } else {
          // add to error list
          errArray.push(tagArray[i]);
        }
      }

      restaurant.tags = origArray;
      let response = {
        tagsAdded: sucArray,
        alreadyInTags: errArray,
        success: true,
      };
      restaurant
        .save()
        .then(() => res.json(response))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/setTags/:id
// Required Fields: tags[]
// Returns: 200 on success, 413 if tag.length > 6, 404 if user not found, 400 if other error
router.route("/setTags/:id").post((req, res) => {
  let restaurantId = req.params.id;
  let tags = req.body.tags;

  if (tags.length > 6) {
    return res.status(413).json("Too many tags, max length 6");
  } else {
    Restaurant.findById(restaurantId)
      .then((restaurant) => {
        restaurant.tags = tags;
        restaurant
          .save()
          .then(() => res.json("Tags Set."))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

// Format: GET /api/restaurants/clearTags/Restaurant._id
// Required Fields: none
// Returns: 404 if restaurant not found, 200 if tags reset, 400 if error
router.route("/clearTags/:id").get((req, res) => {
  let restaurantId = req.params.id;

  Restaurant.findById(restaurantId)
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).json("Restaurant not found.");
      } else {
        restaurant.tags = [];
        restaurant
          .save()
          .then(() => res.json("Tags Cleared"))
          .catch((err) => res.status(400).json("Error: " + err));
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/Restaurant._id
// Required Fields: none
// Returns: All info on a specific restaurant
router.route("/:id").get((req, res) => {
  Restaurant.findById(req.params.id)
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/byOwner/User._id
// Required Fields: none
// Returns: All info on restaurants owned by a particular owner
router.route("/byOwner/:id").get((req, res) => {
  Restaurant.find({ ownerId: req.params.id })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
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
    ownerId,
  });

  newItem
    .save()
    .then(() => res.json("Restaurant added! Id: " + newItem.id))
    .catch((err) => res.status(400).json("Error: " + err));
});

// DEPRECATED - DO NOT USE (only for Insomnia use for migration, very little error checking)
// Format: POST /api/restaurants/addOwner/Restaurant._id
// Required Fields: ownerId
// Returns: Status based on successful/unsuccessful owner update
router.route("/addOwner/:id").post((req, res) => {
  restaurantId = req.params.id;
  ownerId = req.body.ownerId;
  Restaurant.findById(restaurantId)
    .then((restaurants) => {
      restaurants.ownerId = ownerId;
      restaurants
        .save()
        .then(() => res.json("OwnerId updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
