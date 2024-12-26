const mongoose = require("mongoose");

// Define the nested content schema
const aboutCardContentSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: [false, "Content publicId is required"],
  },
  image: {
    type: String,
    required: [true, "Content image is required"], 
  },
  title: {
    type: String,
    required: [true, "Content title is required"],
  },
  description: {
    type: String,
    required: [true, "Content description is required"],
  },
});

// Define the main schema
const aboutCardSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: [false, "Public ID is required"], // Added publicId field
  },
  imageSrc: {
    type: String,
    required: [true, "Image URL is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  content: {
    type: [aboutCardContentSchema],
    required: [true, "Content is required"],
  }, 
});

// Create the model
const AboutCard = mongoose.model("AboutCard", aboutCardSchema);

module.exports = AboutCard;
