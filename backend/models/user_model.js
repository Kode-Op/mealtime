const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: {type: String, required: true, unique: true, trim: true, minlength: 3},
    email: {type: String, required: true, unique: true, trim: true, minlength: 6},
    userName: {type: String, required: true, unique: true, trim: true, minlength: 3},
    password: {type: String, required: true, minlength: 5},
    firstName: {type: String, required: true, trim: true, minlength: 3},
    lastName: {type: String, required: true, trim: true, minlength: 1},
    creditCardName:{type: String, required: true, unique: true, trim: true, minlength: 3},
    creditCardNumber:{type: Number, required: true, trim: true},
    creditCardCCV: {type: Number, required: true, trim: true, maxlength: 4},
    expMonth: {type: Number, required: true, trim: true, maxlength: 2},
    expYear: {type: Number, required: true, trim: true, maxlength: 4},

    
    /*creditCards:{
        type: Array,
        items: {
            type: Array,
            items: [
                { type: String, required: true, unique: true, trim: true, minlength: 3 },
                { type: Number, required: true, trim: true },
                {type: Number, required: true, trim: true, maxlength: 4 },
                {type: Number, required: true, trim: true, maxlength: 2 },
                {type: Number, required: true, trim: true, maxlength: 4 }
            ]
        }
    },*/

    preferencesTag: {
        type: Array,
        items: {
            type: Array,
            items: [
                {
                    type: String,
                    required: true,
                    unique: true
                },
                {
                    type: String,
                    required: true,
                    minimum: 1
                }
            ]
        }
    },
    orderHistory: {
        type: Array,
        items: {
            type: String,
            required: true,
            unique: true
        }
    },
    location: {
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

const user = mongoose.model('user', userSchema);

module.exports = user;