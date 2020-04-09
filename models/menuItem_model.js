const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuItemSchema = new Schema(
  {
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    preptime: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String },
    isHidden: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const menuItem = mongoose.model("menuItem", menuItemSchema);

module.exports = menuItem;
