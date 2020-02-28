const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID: {type: String, required: true, unique: true, trim: true, minlength: 3},
    restaurantID: {type: String, required: true, unique: true, trim: true, minlength: 3},
    deliverylocation: {
        x_coordinate: {
            type: Number,
            required: true
        },
        y_coordinate: {
            type: Number,
            required: true
        },
    },
}, {
    timestamps: true,
});

const order = mongoose.model('order', orderSchema);

module.exports = order;