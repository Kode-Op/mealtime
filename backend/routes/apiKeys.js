const router = require("express").Router();
let ApiKey = require("../models/apiKey_model");

router.route("/").get((req, res) => {
  ApiKey.find()
    .then(apikey => res.json(apikey))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const key = req.body.key;

  const newItem = new ApiKey({
    name,
    key
  });

  newItem
    .save()
    .then(() => res.json("apiKey added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
