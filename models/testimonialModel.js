const mongoose = require("mongoose");

const testimonialContentSchema = new mongoose.Schema({
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

const testimonialSchema = new mongoose.Schema({
  coverimage: {
    type: String,
    required: [true, "Cover image is required"],
  },
  title: {
    type: String,
    required: [true, "Story title is required"],
  },
  content: {
    type: [testimonialContentSchema],
    required: [true, "Content is required"],
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;