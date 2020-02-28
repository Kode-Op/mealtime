const router = require('express').Router();
let MenuItem = require('../models/menuItem_model');

router.route('/').get((req, res) => {
    MenuItem.find()
        .then(menuItems => res.json(menuItems))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) => {
    const item = req.body.item;

    const id = Number(req.body.id);
    const name = req.body.name;
    const price = Number(req.body.price);
    const preptime = Number(req.body.preptime);
    const description = req.body.description;
    const tag = req.body.tag;

    const newItem = new MenuItem({
        id,
        name,
        price,
        preptime,
        description,
        tag,
    });

    newItem.save()
        .then(() => res.json('MenuItem added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;