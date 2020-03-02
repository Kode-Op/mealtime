const router = require('express').Router();
let User = require('../models/user_model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const userID = req.body.userID;
    const email = req.body.email;
    const userName = req.body.userName;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const creditCardName = req.body.creditCardName;
    const creditCardNumber = Number(req.body.creditCardNumber);
    const creditCardCCV = Number(req.body.creditCardCCV);
    const expMonth = Number(req.body.expMonth);
    const expYear = Number(req.body.expYear);
    const location = req.body.location;
    const preferencesTag = req.body.preferencesTag;
    const orderHistory = Array(req.body.orderHistory);

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
        orderHistory,
    })

    newItem
        .save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
  });
  
  router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
  });
  
  router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(users => {
            users.userID = req.body.userID;
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
            users.save()
            .then(() => res.json('User updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router;