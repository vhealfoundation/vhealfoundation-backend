const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  categories: [
    {
      title: {
        type: String,
        required: [true, "Category title is required"],
        enum: [
          "COUNSELLING SERVICES",
          "ASSESSMENTS",
          "TRAINING",
          "COACHING",
          "REHABILITATION OF PRISONERS",
          "LATEST BLOGS"
        ]
      },
      images: [
        {
          url: {
            type: String,
            required: [true, "Image URL is required"],
          },
          caption: {
            type: String,
            default: ""
          }
        }
      ]
    }
  ]
}, { timestamps: true });

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
