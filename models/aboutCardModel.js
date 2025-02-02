const mongoose = require("mongoose");

// Define schema for the AboutCard
const aboutCardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Image URL is required"],
  },
  heading: {
    type: String,
    required: [true, "Heading is required"],
  },
  subheading: {
    type: String,
    required: [true, "Subheading is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  features: {
    type: [String],
    required: [true, "Features are required"],
  },
  reverse: {
    type: Boolean,
    required: true, 
  },
});

// Create the AboutCard model
const AboutCard = mongoose.model("AboutCard", aboutCardSchema);

module.exports = AboutCard;
