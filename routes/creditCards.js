const router = require("express").Router();
let CreditCard = require("../models/creditCard_model");

// Format: POST /api/creditCards/add
// Required Fields: firstName, lastName, userId, number (unique)
// Returns: Status based on successful/unsuccessful adding of Credit Card
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const number = req.body.number;
  const exMonth = req.body.exMonth;
  const exYear = req.body.exYear;
  const ccv = req.body.ccv;
  const address = req.body.address;
  const isDeleted = false;

  const newItem = new CreditCard({
    userId,
    firstName,
    lastName,
    number,
    exMonth,
    exYear,
    ccv,
    address,
    isDeleted
  });

  newItem
    .save()
    .then(() => res.json("credit card added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: GET /api/creditCards/User._id
// Returns: Returns JSON packages of all credit cards associated with a user
router.get("/:id", function(req, res) {
  const user = req.params.id;

  CreditCard.find({
    userId: user,
    isDeleted: false
  })
    .then(CreditCard => res.json(CreditCard))
    .catch(err => res.status(400).json("Error: " + err));
});

// Format: DELETE /api/creditCards/CreditCard._id
// Returns: Status based on successful/unsuccessful deletion of Credit Card
router.route("/:id").delete((req, res) => {
  CreditCard.findById(req.params.id).then(creditCard => {
    creditCard.isDeleted = true;
    creditCard
      .save()
      .then(() => res.json("Credit Card deleted."))
      .catch(err => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
