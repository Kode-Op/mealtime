const router = require("express").Router();
let User = require("../models/user_model");
let UserSession = require("../models/userSession_model");

// NOT FOR USE IN LIVE DEPLOYMENT, REQUIRED FOR ADMIN USE
// Format: GET /api/users/
// Required Fields: none
// Returns: All info on all users
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// NOT FOR USE IN LIVE DEPLOYMENT, REQUIRED FOR ADMIN USE
// Format: DELETE /api/users/User._id
// Required Fields: none
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful user deletion
// WARNING: Deletes document, cannot be undone
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// NOT FOR USE IN LIVE DEPLOYMENT, REQUIRED FOR ADMIN USE
// Format: GET /api/users/makeOwner/User._id
// Required Fields: none
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful update of user to be an owner
router.route("/makeOwner/:id").get((req, res) => {
  var userId = req.params.id;
  User.findById(userId).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else {
      // found
      users.isOwner = true;
      users
        .save()
        .then(() => res.json("User is now an Owner."))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
});

// Format: POST /api/users/add
// Required Fields: email, firstName, lastName, password
// Returns: Status based on successful/unsuccessful account creation
router.route("/add").post((req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const address = req.body.address;
  const isOwner = req.body.isOwner;

  const newItem = new User({
    email,
    firstName,
    lastName,
    password,
    address,
    isOwner,
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

// Format: POST /api/users/login
// Required Fields: email, password
// Returns: Status on login attempt. If successful, creates a sessions token
router.route("/login").post((req, res) => {
  var email = req.body.email;
  email = email.toLowerCase();
  var password = req.body.password;

  User.findOne({ email: email }, function (err, user) {
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
            message: "Error: server error",
          });
        }

        return res.status(200).send({
          success: true,
          message: "Valid sign in",
          token: doc._id,
        });
      });
    } else {
      // incorrect password
      return res.status(404).send({
        success: false,
        message: "invalid password",
      });
    }
  });
});

// Format: GET /api/users/verify/Token._id
// Required Parameters: Token._id
// Returns: success: true/false if valid sessions token
router.route("/verify/:id").get((req, res) => {
  const token = req.params.id;

  UserSession.findById(token)
    .then((session) => {
      if (!session) {
        // not found
        return res.status(404).send({
          success: false,
          message: "No valid token",
        });
      } else if (!session.isDeleted) {
        User.findById(session.userId)
          .then((user) => {
            if (!user) {
              // user not found
              return res.status(404).send({
                success: false,
                message: "User not found.",
              });
            } else {
              let response = {
                success: true,
                message: "Valid token",
                data: user,
              };
              return res.status(200).json(response);
            }
          })
          .catch((err) => res.status(500).json("Error: " + err));
      } else {
        return res.status(500).send({
          success: false,
          message: "Stale token",
        });
      }
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

// Format: GET /api/users/logout
// Required Parameters: Token._id
// Returns: success: true/false if valid sessions token is found + deactivated
router.route("/logout/:id").get((req, res) => {
  const token = req.params.id;

  UserSession.findById(token).then((session) => {
    session.isDeleted = true;
    session
      .save()
      .then(() => res.json("Token Invalidated."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

// Format: POST /api/users/updateName/User._id
// Required Fields: firstName, lastName, password
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful name update
router.route("/updateName/:id").post((req, res) => {
  var password = req.body.password;
  User.findById(req.params.id).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else if (users.validPassword(password)) {
      users.firstName = req.body.firstName;
      users.lastName = req.body.lastName;
      users
        .save()
        .then(() => res.json("Name updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      return res.status(500).json("Invalid Password").send();
    }
  });
});

// Format: POST /api/users/updatePassword/User._id
// Required Fields: oldPassword, newPassword
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful password update
router.route("/updatePassword/:id").post((req, res) => {
  var oldPassword = req.body.oldPassword;
  User.findById(req.params.id).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else if (users.validPassword(oldPassword)) {
      users.password = users.generateHash(req.body.newPassword);
      users
        .save()
        .then(() => res.json("Password updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      return res.status(500).json("Invalid Old Password").send();
    }
  });
});

// Format: POST /api/users/updateEmail/User._id
// Required Fields: email, password
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful name update
router.route("/updateEmail/:id").post((req, res) => {
  var password = req.body.password;
  User.findById(req.params.id).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else if (users.validPassword(password)) {
      users.email = req.body.email;
      users
        .save()
        .then(() => res.json("Email updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      return res.status(500).json("Invalid Password").send();
    }
  });
});

// Format: POST /api/users/updatePhone/User._id
// Required Fields: phone (String), password
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful phone update
router.route("/updatePhone/:id").post((req, res) => {
  var password = req.body.password;
  User.findById(req.params.id).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else if (users.validPassword(password)) {
      users.phone = req.body.phone;
      users
        .save()
        .then(() => res.json("Phone number updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      return res.status(500).json("Invalid Password").send();
    }
  });
});

// Format: POST /api/users/updateAddress/User._id
// Required Fields: address (String)
// Required Parameters: User._id
// Returns: Status based on successful/unsuccessful address update
router.route("/updateAddress/:id").post((req, res) => {
  User.findById(req.params.id).then((users) => {
    if (!users) {
      // not found
      return res.status(404).json("Not Found.").send();
    } else {
      users.address = req.body.address;
      users
        .save()
        .then(() => res.json("Address updated."))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
});

// Format: POST /api/users/updateTags/User._id
// Required Fields: tags[]
// Required Parameters: User._id
// Returns: 200 on success, 404 if user not found, 400 if other error
router.route("/updateTags/:id").post((req, res) => {
  let userId = req.params.id;
  let tags = req.body.tags;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        // user not found
        return res.status(404).json("User not found.");
      } else {
        user.tags = tags;
        user
          .save()
          .then(() => res.json("Tags Set."))
          .catch((err) => res.status(401).json("Error: " + err));
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
