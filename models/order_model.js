const mongoose = require('mongoose');
let MenuItem = require("./menuItem_model");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID: {type: String, required: true},
    restaurantID: {type: String, required: true},
    menuItems:{type: Array, required:true},
    quantityMenuItems:{type: Array, required:true, items:{type:Number}},
    prepTime:{type:Number, required:true},
    deliverylocation: {
        type: String,
        required:true
    },
    isCanceled:{type:Boolean, default:false},
    isFulfilled:{type:Boolean, default:false}
    }, 
{
    timestamps: true,
});

orderSchema.methods.orderDone = function(){
    if(!isCanceled){
        isFulfilled = true;
    }
    return isFulfilled;
};

const order = mongoose.model('order', orderSchema);

module.exports = order;