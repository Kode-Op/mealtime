const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    restaurantid: {
      type: String,
      required: true
    },
    userid: {
      type: String,
      required: true
    },
    review: {
      type: Array,
      items: [
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean },
        { type: Boolean }
      ],
      additionalItems: false
    }
  },
  {
    timestamps: true
  }
);

const review = mongoose.model("review", reviewSchema);

module.exports = review;
