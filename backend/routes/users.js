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
    //const creditCard = req.body.creditCard;
    //
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
        //creditCard,
        //
        creditCardName,
        creditCardNumber,
        creditCardCCV,
        expMonth,
        expYear,
        //
        location,
        preferencesTag,
        orderHistory,
    })

    newItem
        .save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;