const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const creditCardSchema = new Schema(
  {
    userId: {
      type: String,
      default: ""
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    number: {
      type: String,
      default: "0000000000000000",
      minlength: 16,
      maxlength: 16
    },
    exMonth: {
      type: Number,
      default: 1,
      min: 1,
      max: 12
    },
    exYear: {
      type: Number,
      default: 2020,
      min: 2019,
      max: 9999
    },
    ccv: {
      type: Number,
      default: 111,
      min: 100,
      max: 999
    },
    address: {
      type: String,
      default: ""
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false
  }
);

const creditCard = mongoose.model("creditCard", creditCardSchema);

module.exports = creditCard;
