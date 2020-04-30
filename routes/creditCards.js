const router = require("express").Router();
let CreditCard = require("../models/creditCard_model");

// Format: POST /api/creditCards/add
// Required Fields: firstName, lastName, userId, number
// Optional Fields: exMonth, exYear, ccv, address, isDeleted
// Returns: Status based on successful/unsuccessful adding
//          of Credit Card and returns new CreditCard._id
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const number = req.body.number;
  const exMonth = req.body.exMonth;
  const exYear = req.body.exYear;
  const ccv = req.body.ccv;
  const address = req.body.address;
  let isDeleted = false;

  if (req.body.isDeleted != null) {
    isDeleted = req.body.isDeleted;
  }

  const makeCard = (card) => {
    return new Promise(function (resolve, reject) {
      card
        .save()
        .then(() => resolve("Card added!"))
        .catch((err) => reject("Error: " + err));
    });
  };

  const retrieveCard = (userid) => {
    return new Promise(function (resolve, reject) {
      CreditCard.find({ userId: userid })
        .then((cards) => {
          resolve(cards[cards.length - 1]._id);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });
  };

  const createCard = async (_) => {
    const newItem = new CreditCard({
      userId,
      firstName,
      lastName,
      number,
      exMonth,
      exYear,
      ccv,
      address,
      isDeleted,
    });

    result1 = await makeCard(newItem);
    result2 = await retrieveCard(userId);

    response = {
      message: result1,
      id: result2,
    };

    res.json(response);
  };

  createCard();
});

// Format: GET /api/creditCards/User._id/showDeleted=Boolean
// Required parameters: User._id
// Optional Parameters: isDeleted
// Returns: Returns JSON packages of all credit cards associated with a user
router.route("/:id/:showDeleted?").get((req, res) => {
  const user = req.params.id;
  const showDeleted = req.params.showDeleted;

  if (showDeleted) {
    CreditCard.find({
      userId: user,
    })
      .then((CreditCard) => res.json(CreditCard))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    CreditCard.find({
      userId: user,
      isDeleted: false,
    })
      .then((CreditCard) => res.json(CreditCard))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

// Format: DELETE /api/creditCards/CreditCard._id
// Required parameters: CreditCard._id
// Returns: Status based on successful/unsuccessful deletion of Credit Card
// Note: This does not delete the document from the database
router.route("/:id").delete((req, res) => {
  CreditCard.findById(req.params.id).then((creditCard) => {
    creditCard.isDeleted = true;
    creditCard
      .save()
      .then(() => res.json("Credit Card deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
