const router = require("express").Router();
let User = require("../models/user_model");
let UserSession = require("../models/userSession_model");

// DEPRECATED - DO NOT USE
// Format: GET /api/users/
// Required Fields: none
// Returns: All info on all users
router.route("/").get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: POST /api/add
// Required Fields: email, firstName, lastName, password
// Returns: Status based on successful/unsuccessful account creation
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

// Format: GET /api/users/User._id
// Required Fields: none
// Returns: All info on a specific users
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: POST /api/users/login
// Required Fields: email, password
// Returns: Status on login attempt. If successful, creates a sessions token
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

// Format: GET /api/users/verify
// Required Fields: token
// Returns: success: true/false if valid sessions token
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

// Format: GET /api/users/logout
// Required Fields: token
// Returns: success: true/false if valid sessions token is found + deactivated
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

// Format: DELETE /api/users/User._id
// Returns: Status based on successful/unsuccessful user deletion
// WARNING: Cannot be undone
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

// DEPRECATED - DO NOT USE
// Format: POST /api/users/update/User._id
// Required Fields: email, firstName, lastName, password, address
// Returns: Status based on successful/unsuccessful name update
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

// Format: POST /api/users/updateName/User._id
// Required Fields: firstName, lastName, password
// Returns: Status based on successful/unsuccessful name update
router.route("/updateName/:id").post((req, res) => {
  var password = req.body.password;
  User.findById(req.params.id).then(users => {
    if (!users) {
      // not found
      return res
        .status(404)
        .json("Not Found.")
        .send();
    } else if (users.validPassword(password)) {
      users.firstName = req.body.firstName;
      users.lastName = req.body.lastName;
      users
        .save()
        .then(() => res.json("Name updated."))
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      return res
        .status(500)
        .json("Invalid Password")
        .send();
    }
  });
});

// Format: POST /api/users/updatePassword/User._id
// Required Fields: oldPassword, newPassword
// Returns: Status based on successful/unsuccessful password update
router.route("/updatePassword/:id").post((req, res) => {
  var oldPassword = req.body.oldPassword;
  User.findById(req.params.id).then(users => {
    if (!users) {
      // not found
      return res
        .status(404)
        .json("Not Found.")
        .send();
    } else if (users.validPassword(oldPassword)) {
      users.password = users.generateHash(req.body.newPassword);
      users
        .save()
        .then(() => res.json("Password updated."))
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      return res
        .status(500)
        .json("Invalid Old Password")
        .send();
    }
  });
});

// Format: POST /api/users/updateEmail/User._id
// Required Fields: email, password
// Returns: Status based on successful/unsuccessful name update
router.route("/updateEmail/:id").post((req, res) => {
  var password = req.body.password;
  User.findById(req.params.id).then(users => {
    if (!users) {
      // not found
      return res
        .status(404)
        .json("Not Found.")
        .send();
    } else if (users.validPassword(password)) {
      users.email = req.body.email;
      users
        .save()
        .then(() => res.json("Email updated."))
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      return res
        .status(500)
        .json("Invalid Password")
        .send();
    }
  });
});

// Format: POST /api/users/updateEmail/User._id
// Required Fields: phone (String)
// Returns: Status based on successful/unsuccessful phone update
router.route("/updatePhone/:id").post((req, res) => {
  User.findById(req.params.id).then(users => {
    if (!users) {
      // not found
      return res
        .status(404)
        .json("Not Found.")
        .send();
    }
    users.phone = req.body.phone;
    users
      .save()
      .then(() => res.json("Phone number updated."))
      .catch(err => res.status(400).json("Error: " + err));
  });
});

// Format: POST /api/users/updateAddress/User._id
// Required Fields: address (String)
// Returns: Status based on successful/unsuccessful address update
router.route("/updateAddress/:id").post((req, res) => {
  User.findById(req.params.id).then(users => {
    if (!users) {
      // not found
      return res
        .status(404)
        .json("Not Found.")
        .send();
    }
    users.address = req.body.address;
    users
      .save()
      .then(() => res.json("Address updated."))
      .catch(err => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
