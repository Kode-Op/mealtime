const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let CreditCard = require("../models/creditCard_model");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5
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
    address: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
