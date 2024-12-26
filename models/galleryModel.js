const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  images: [
    {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
    },
  ],
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
