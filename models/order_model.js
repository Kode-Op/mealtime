const mongoose = require('mongoose');
let MenuItem = require("./menuItem_model");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID: {type: String, required: true},
    restaurantID: {type: String, required: true},
    menuItems:{type: Array, require:true},
    quantityMenuItems:{type: Array, required:true, items:{type:Number}},
    deliverylocation: {
        type: String,
        required:true
    },
    canceled:{type:Boolean, default:false}
    }, 
{
    timestamps: true,
});

const order = mongoose.model('order', orderSchema);

module.exports = order;