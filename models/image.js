var mongoose = require("mongoose");
var connection = require("../connection");

var imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  filename: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});
var imageModel = new mongoose.model("Image", imageSchema);

module.exports = {
  ImageModel: imageModel,
  ImageSchema: imageSchema,
};
