const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, minimum: 0, maximum: 5 },
    rating: { type: Number, minimum: 0, maximum: 10 },
    description: { type: String, required: true },
    minorder: { type: Number, default: 1 },
    address: {
      type: String,
      default: ""
    },
    hoursofoperation: {
      type: Array,
      items: [
        {
          type: Array,
          //Sunday
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Monday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Tuesday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Wednesday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Thursday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Friday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        },
        //Saturday
        {
          items: [
            //Start time 1
            {
              type: Number,
              minimum: 0,
              maximum: 2359
            },
            //End time 1
            {
              type: Number,
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
          additionalItems: false
        }
      ],
      additionalItems: false
    },
    ownerId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const restaurant = mongoose.model("restaurant", restaurantSchema);

module.exports = restaurant;
