const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {type: String, required: true, unique: true, trim: true, minlength: 3},
    price: {type: Number, required: true, minimum: 0, maximum: 5},
    rating: {type: Number, minimum: 1, maximum: 5},
    description: {type: String, required: true},
    minorder: {type: Number, required: true, minimum: 0},
    tag: {
        type: Array,
        items: {
            type: Array,
            items: [
                {
                    type: Number,
                    required: true,
                    unique: true
                },
                {
                    type: Number,
                    required: true,
                    minimum: 1
                }
            ]
        }
    },
    menuitem: {
        type: Array,
        items: {
            type: Number,
            required: true,
            unique: true
        }
    },
    hoursofoperation: {
        type: Array,
        items: [
            type: Array,
            //Sunday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            },
            //Monday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                ],
                "additionalItems": false
            },
            //Tuesday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            },
            //Wednesday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            },
            //Thursday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            },
            //Friday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            },
            //Saturday
            {
                items: [
                    //Start time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 1
                    {
                        type: Number,
                        required: true,
                        minimum: 0,
                        maximum: 2359
                    },
                    //Start time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    },
                    //End time 2
                    {
                        type: Number,
                        minimum: 0,
                        maximum: 2359
                    }
                ],
                "additionalItems": false
            }
        ],
        "additionalItems": false
    }
}, {
    timestamps: true,
});

const restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = restaurant;