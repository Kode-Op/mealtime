const mongoose = require('mongoose');

const userSessionSchema = new.mongoose.Schema({
    userID: {
        type: Number,
        default: -1
    },
    timestamp: {
        type: Date;
        default: Date.now()
    },
    isDeleted: {
        type: Boolean
        default: false
    }
});

module.exports = mongoose.model('userSession', userSessionSchema);