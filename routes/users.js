const router = require("express").Router();
let User = require("../models/user_model");

router.route("/").get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const userID = req.body.email;
  const email = req.body.email;
  const userName = "";
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const creditCardName = "";
  const creditCardNumber = Number(0);
  const creditCardCCV = Number(0);
  const expMonth = Number(0);
  const expYear = Number(0);
  const location = { x_coordinate: Number(0), y_coordinate: Number(0) };
  const preferencesTag = Array([""]);
  const orderHistory = Array([""]);

  const newItem = new User({
    userID,
    email,
    userName,
    firstName,
    lastName,
    password,
    creditCardName,
    creditCardNumber,
    creditCardCCV,
    expMonth,
    expYear,
    location,
    preferencesTag,
    orderHistory
  });

  newItem
    .save()
    .then(() => res.json("User added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

router.post("/register", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  var newuser = new user();
  newuser.email = email;
  newuser.password = password;
  newuser.firstName = firstName;
  newuser.lastName = lastName;
  newuser.save(function(err, savedUser) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  });
});

router.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email, password: password }, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    if (!user) {
      return res.status(404).send();
    } else {
      return res.status(200).send();
    }
  });
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id)
    .then(users => {
      users.userID = "";
      users.email = req.body.email;
      users.userName = req.body.userName;
      users.firstName = req.body.firstName;
      users.lastName = req.body.lastName;
      users.password = req.body.password;
      users.creditCardName = req.body.creditCardName;
      users.creditCardNumber = Number(req.body.creditCardNumber);
      users.creditCardCCV = Number(req.body.creditCardCCV);
      users.expMonth = Number(req.body.expMonth);
      users.expYear = Number(req.body.expYear);
      users.location = req.body.location;
      users.preferencesTag = req.body.preferencesTag;
      users.orderHistory = Array(req.body.orderHistory);
      users
        .save()
        .then(() => res.json("User updated!"))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
