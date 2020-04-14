const mongoose = require("mongoose");
let MenuItem = require("./menuItem_model");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    creditCardId: { type: String, required: true },
    menuItems: { type: Array, required: true },
    prepTime: { type: Number },
    address: { type: String, required: true },
    isCanceled: { type: Boolean, required: true, default: false },
    isFulfilled: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema);

module.exports = order;
