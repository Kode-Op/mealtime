const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true, unique: true, trim: true, minlength: 8},
    price: {type: Number, required: true},
    preptime: {type: Number, required: true},
    description: {type: String, required: true},
    tag: {type: String, required: true}
}, {
    timestamps: true,
});

const menuItem = mongoose.model('menuItem', menuItemSchema);

module.exports = menuItem;