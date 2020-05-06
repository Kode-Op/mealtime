const router = require("express").Router();
let Restaurant = require("../models/restaurant_model");
let User = require("../models/user_model");

// Format: GET /api/restaurants/
// Required Fields: none
// Returns: All info on all restaurants
router.route("/").get((req, res) => {
  Restaurant.find({ isDeleted: false })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/filter/
// Required Fields: tags[], priceLow, priceHigh, ratings
// Optional Fields: userId
// Returns: All info on restaurants containing corresponding filter of tags,
//          pricing, and rating, sorted by user's preferences
router.route("/filter").post((req, res) => {
  let notLoggedIn = false;
  let userId = "";
  if (req.body.userId) {
    userId = req.body.userId;
  } else {
    notLoggedIn = true;
  }
  const tagArray = req.body.tags;
  const ratings = Number(req.body.ratings);
  const priceLow = Number(req.body.priceLow);
  const priceHigh = Number(req.body.priceHigh);

  const retrieveRestaurants = () => {
    return new Promise(function (resolve, reject) {
      if (
        ratings > 10 ||
        ratings < 0 ||
        priceLow > priceHigh ||
        priceHigh > 5 ||
        priceLow > 5 ||
        priceLow < 0 ||
        priceHigh < 0
      ) {
        res.status(400).json("Error, out of scope of the parameters");
      } else {
        if (tagArray.length > 0 && priceHigh > 0) {
          Restaurant.find({
            tags: { $all: tagArray },
            rating: { $gte: ratings },
            price: { $gte: priceLow, $lte: priceHigh },
            isDeleted: false,
          })
            .then((restaurants) => resolve(restaurants))
            .catch((err) => res.status(400).json("Error: " + err));
        } else if (tagArray.length > 0 && priceLow == 0 && priceHigh == 0) {
          Restaurant.find({
            tags: { $all: tagArray },
            rating: { $gte: ratings },
            isDeleted: false,
          })
            .then((restaurants) => resolve(restaurants))
            .catch((err) => res.status(400).json("Error: " + err));
        } else if (tagArray.length == 0 && priceHigh > 0) {
          Restaurant.find({
            rating: { $gte: ratings },
            price: { $gte: priceLow, $lte: priceHigh },
            isDeleted: false,
          })
            .then((restaurants) => resolve(restaurants))
            .catch((err) => res.status(400).json("Error: " + err));
        } else if (tagArray.length == 0 && priceLow == 0 && priceHigh == 0) {
          Restaurant.find({ rating: { $gte: ratings }, isDeleted: false })
            .then((restaurants) => resolve(restaurants))
            .catch((err) => res.status(400).json("Error: " + err));
        }
      }
    });
  };

  const grabTags = (id) => {
    return new Promise(function (resolve, reject) {
      User.findById(id)
        .then((user) => resolve(user.tags))
        .catch((err) => res.status(400).json("Error: " + err));
    });
  };

  const sortByTag = (restList, tags) => {
    return new Promise(async function (resolve, reject) {
      let sortedList = [];

      const contains = (list, key) => {
        return new Promise(function (resolve, reject) {
          for (let i = 0; i < list.length; i++) {
            if (list[i] == key) {
              resolve(true);
            }
          }
          resolve(false);
        });
      };

      const move = (toList, fromList, index) => {
        return new Promise(function (resolve, reject) {
          toList.push(fromList[index]);
          fromList.splice(index, 1);
          index--;
          resolve(index);
        });
      };

      const internalSort = (_) => {
        return new Promise(async function (resole, reject) {
          for (let i = 0; i < tags.length; i++) {
            for (let j = 0; j < restList.length; j++) {
              let doesContain = await contains(restList[j].tags, tags[i]);
              if (doesContain) {
                j = await move(sortedList, restList, j);
              }
            }
          }
          for (let i = 0; i < restList.length; i++) {
            sortedList.push(restList[i]);
          }
          resolve(sortedList);
        });
      };

      result = await internalSort();
    });
  };

  const handleRestaurants = async (noUser) => {
    let restaurantList = await retrieveRestaurants();
    if (!noUser) {
      const userTags = await grabTags(userId);
      const results = await sortByTag(restaurantList, userTags);
      res.json(results);
    } else {
      res.json(restaurantList);
    }
  };

  handleRestaurants(notLoggedIn);
});

// Format: GET /api/restaurants/Restaurant._id
// Required Fields: none
// Required Parameters: Restaurant._id
// Returns: All info on a specific restaurant
router.route("/:id").get((req, res) => {
  Restaurant.findById(req.params.id)
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/restaurants/byOwner/User._id
// Required Fields: none
// Required Parameters: User._id (of owner)
// Returns: All info on restaurants owned by a particular owner
router.route("/byOwner/:id").get((req, res) => {
  Restaurant.find({ ownerId: req.params.id, isDeleted: false })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/add
// Required Fields: name, price, rating, descrption, address, hours of operation, ownerId, tags
// Returns: Status based on successful/unsuccessful restaurant creation and new Restaurant._id
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);
  const description = req.body.description;
  const minorder = Number(req.body.price);
  const address = req.body.address;
  const hoursofoperation = req.body.hoursofoperation;
  const ownerId = req.body.ownerId;
  const isDeleted = false;
  const tags = req.body.tags;

  const makeRestaurant = (restaurant) => {
    return new Promise(function (resolve, reject) {
      restaurant
        .save()
        .then(() => resolve("Restaurant added!"))
        .catch((err) => reject("Error: " + err));
    });
  };

  const retrieveRestaurant = (ownerId) => {
    return new Promise(function (resolve, reject) {
      Restaurant.find({ ownerId: ownerId })
        .then((restaurants) => {
          resolve(restaurants[restaurants.length - 1]._id);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });
  };

  const createRestaurant = async (_) => {
    const newItem = new Restaurant({
      name,
      price,
      rating,
      description,
      minorder,
      address,
      hoursofoperation,
      ownerId,
      isDeleted,
      tags,
    });

    result1 = await makeRestaurant(newItem);
    result2 = await retrieveRestaurant(ownerId);

    response = {
      message: result1,
      id: result2,
    };

    res.json(response);
  };
  createRestaurant();
});

// Format: POST /api/restaurants/update/Restaurant._id
// Required Fields: ownerId minorder, address, hoursofoperation, tags, name, price, rating, description
// Required Parameters: Restaurant._id
// Returns: Status based on successful/unsuccessful restaurant update
router.route("/update/:id").post((req, res) => {
  minorder = req.body.minorder;
  address = req.body.address;
  hoursofoperation = req.body.hoursofoperation;
  tags = req.body.tags;
  name = req.body.name;
  price = req.body.price;
  rating = req.body.rating;
  description = req.body.description;

  Restaurant.findById(req.params.id)
    .then((restaurant) => {
      restaurant.minorder = minorder;
      restaurant.address = address;
      restaurant.hoursofoperation = hoursofoperation;
      restaurant.tags = tags;
      restaurant.name = name;
      restaurant.price = price;
      restaurant.rating = rating;
      restaurant.description = description;

      restaurant
        .save()
        .then(() => res.json("Restaurant Updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: DELETE /api/restaurants/Restaurant._id
// Required Fields: none
// Required Parameters: Restaurant._id
// Returns: Status based on successful/unsuccessful restaurant deletion
// Note: this does not delete the document, sets isDeleted to true
router.route("/:id").delete((req, res) => {
  Restaurant.findById(req.params.id)
    .then((restaurant) => {
      restaurant.isDeleted = true;
      restaurant
        .save()
        .then(() => res.json("Restaurant Deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
