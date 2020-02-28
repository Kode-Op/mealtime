const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  img: {
    data: Buffer,
    contenttype: String
  }
});

const image = mongoose.model("image", imageSchema);

module.exports = image;
