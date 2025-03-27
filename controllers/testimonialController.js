const Testimonial = require("../models/testimonialModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a new testimonial
exports.createTestimonial = asyncErrorHandler(async (req, res, next) => {
  const testimonial = await Testimonial.create(req.body);

  res.status(201).json({
    success: true,
    data: testimonial,
  });
});

// Get all testimonials
exports.getTestimonials = asyncErrorHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find();

  res.status(200).json({
    success: true,
    data: testimonials,
  });
});

// Get a single testimonial by ID
exports.getTestimonialById = asyncErrorHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }

  res.status(200).json({
    success: true,
    data: testimonial,
  });
});

// Update a testimonial by ID
exports.updateTestimonial = asyncErrorHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }

  res.status(200).json({
    success: true,
    data: testimonial,
  });
});

// Delete a testimonial by ID
exports.deleteTestimonial = asyncErrorHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});