const router = require("express").Router();
let User = require("../models/user_model");
let UserSession = require("../models/userSession_model");

router.route("/").get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const address = req.body.address;

  const newItem = new User({
    email,
    firstName,
    lastName,
    password,
    address
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

  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return res.status(500).send();
    }
    if (!user) {
      // not found
      return res.status(404).send();
    } else if (user.validPassword(password)) {
      // found
      // if found => create new session
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error"
          });
        }

        return res.status(200).send({
          success: true,
          message: "Valid sign in",
          token: doc._id
        });
      });
    } else {
      // incorrect password
      return res.status(404).send();
    }
  });
});

router.get("/verify/:id", function(req, res) {
  const token = req.params.id;

  UserSession.findOne(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }
      return res.send({
        success: true,
        message: "Good"
      });
    }
  );
});

router.get("/logout/:id", function(req, res) {
  const token = req.params.id;

  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    { $set: { isDeleted: true } },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server Error"
        });
      }

      return res.send({
        success: true,
        message: "Good"
      });
    }
  );
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id).then(users => {
    users.email = req.body.email;
    users.firstName = req.body.firstName;
    users.lastName = req.body.lastName;
    users.password = req.body.password;
    users.address = req.body.address;
    users
      .save()
      .then(() => res.json("User updated."))
      .catch(err => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
