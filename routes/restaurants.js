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

// Format: GET /api/restaurants/byTag/:tag (tag is an int in range (1,42))
// Required Fields: none
// Returns: All info on restaurants containing corresponding tag
router.route("/byTag/:tag").get((req, res) => {
  let tag = Number(req.params.tag);
  Restaurant.find({ tags: tag, isDeleted: false })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/filter/
// Required Fields: tags[], priceLow, priceHigh, ratings, userId
// Returns: All info on restaurants containing corresponding filter of tags, pricing, and rating
router.route("/filter").post((req, res) => {
  const userId = req.body.userId;
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
      resolve(sortedList);
    });
  };

  const handleRestaurants = async (_) => {
    let restaurantList = await retrieveRestaurants();
    const userTags = await grabTags(userId);
    const results = await sortByTag(restaurantList, userTags);
    res.json(results);
  };

  handleRestaurants();
});

// DEPRECATED - DO NOT USE (only for Insomnia use for migration, no max length check, limited error checks)
// Format: POST /api/restaurants/addTags/._id
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

// Format: POST /api/restaurants/setTags/._id
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
        if (!restaurant) {
          // Restaurant not found
          return res.status(404).json("Restaurant not found.");
        }
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
  Restaurant.find({ ownerId: req.params.id, isDeleted: false })
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/restaurants/add
// Required Fields: name, price, rating, descrption, address, hours of operation, ownerId, tags
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
  const isDeleted = false;
  const tags = req.body.tags;

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

// Format: POST /api/restaurants/update/Restaurant._id
// Required Fields: ownerId minorder, address, hoursofoperation, tags, name, price, rating, description
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
// Returns: Status based on successful/unsuccessful restaurant deletion
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
