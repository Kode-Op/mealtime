const router = require("express").Router();
let User = require("../models/user_model");
let CreditCard = require("../models/creditCard_model");

// Format: POST /api/creditCards/add
// Required Fields: firstName, lastName, userId, number
// Returns: Status based on successful/unsuccessful adding of Credit Card and CreditCard._id
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
// Returns: Returns JSON packages of all credit cards associated with a user
router.get("/:id/:showDeleted?", function (req, res) {
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
// Returns: Status based on successful/unsuccessful deletion of Credit Card
router.route("/:id").delete((req, res) => {
  CreditCard.findById(req.params.id).then((creditCard) => {
    creditCard.isDeleted = true;
    creditCard
      .save()
      .then(() => res.json("Credit Card deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

// Format: POST /api/creditCards/updateCard/CreditCard._id
// Required Fields: firstName, lastName, number, exMonth, exYear, ccv, address
// Returns: Status based on successful/unsuccessful card update
router.route("/updateCard/:id").post((req, res) => {
  var password = req.body.password;
  let userId = "";
  CreditCard.findById(req.params.id).then((card) => {
    if (!card) {
      return res.status(404).json("Card Not Found.").send();
    } else {
      userId = card.userId;
    }
    User.findById(userId).then((users) => {
      if (!users) {
        // not found
        return res.status(404).json("User Not Found.").send();
      } else {
        card.firstName = req.body.firstName;
        card.lastName = req.body.lastName;
        card.number = req.body.number;
        card.exMonth = req.body.exMonth;
        card.exYear = req.body.exYear;
        card.ccv = req.body.ccv;
        card.address = req.body.address;

        card
          .save()
          .then(() => res.json("Card updated."))
          .catch((err) => res.status(400).json("Error: " + err));
      }
    });
  });
});

module.exports = router;
