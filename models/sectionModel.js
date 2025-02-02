const mongoose = require("mongoose"); 

const sectionSchema = new mongoose.Schema({
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

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
