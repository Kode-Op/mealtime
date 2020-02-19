const mongoose = require('mongoose');

import { Schema } from "mongoose";

const menuItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 8
    },
}, {
    timestamps: true,
});

const menuItem = mongoose.model('menuItem', menuItemSchema);

module.exports = menuItem;