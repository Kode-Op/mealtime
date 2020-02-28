const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apiKeySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    key: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
);

const apiKey = mongoose.model("apiKey", apiKeySchema);

module.exports = apiKey;
