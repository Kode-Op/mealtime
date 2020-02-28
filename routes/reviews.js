const router = require("express").Router();
let Review = require("../models/review_model");

router.route("/").get((req, res) => {
  Review.find()
    .then(review => res.json(review))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const restaurantid = req.body.restaurantid;
  const userid = req.body.userid;
  const review = req.body.review;

  const newItem = new Review({
    restaurantid,
    userid,
    review
  });

  newItem
    .save()
    .then(() => res.json("Review added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
