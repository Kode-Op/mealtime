const router = require("express").Router();
let User = require("../models/user_model");
let UserSession = require("../models/userSession_model");

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

  newItem.password = newItem.generateHash(password);
  newItem.email = email.toLowerCase();

  newItem
    .save()
    .then(() => res.json("User added!"))
    .catch(() => {
      User.find({ email: email }, (err, previousUsers) => {
        if (previousUsers.length > 0) {
          res.status(403).json("Error: Account already exists");
        } else if (err) {
          res.status(400).json("Error: " + err);
        }
      });
    });
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

router.post("/login", function(req, res) {
  var email = req.body.email;
  email = email.toLowerCase();
  var password = req.body.password;

  User.findOne({ email: email}, function(err, user) {
    if (err) {
      return res.status(500).send();
    }
    if (!user) {                               // not found
      return res.status(404).send();
    } else if (user.validPassword(password)) { // found
      // if found => create new session
      console.log('found correct user');
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.status(200).send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });

    } else {                                   // incorrect password
      return res.status(404).send();
    }
  });
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id).then(users => {
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
      .then(() => res.json("User updated."))
      .catch(err => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
