const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    custFirst: {
      type: String,
      required: true,
    },
    custLast: {
      type: String,
      required: true,
    },
    custPhone: {
      type: String,
      required: true,
    },
    custAddress: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    creditCardId: {
      type: String,
      required: true,
    },
    lastFour: {
      type: String,
      required: true,
    },
    menuItems: {
      type: Array,
      required: true,
    },
    quantity: {
      type: Array,
      required: true,
    },
    prepTime: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    totalPaid: {
      type: Number,
      requred: true,
    },
    instructions: {
      type: String,
      default: "",
    },
    isCanceled: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFulfilled: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema);

module.exports = order;
