const Section = require("../models/sectionModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
 
// Create a new section
exports.createSection = asyncErrorHandler(async (req, res, next) => {
  const section = await Section.create(req.body);

  res.status(201).json({
    success: true,
    data: section,
  });
});

// Get all sections
exports.getSections = asyncErrorHandler(async (req, res, next) => {
  const sections = await Section.find();

  res.status(200).json({
    success: true,
    data: sections,
  });
});

// Get a single section by ID
exports.getSectionById = asyncErrorHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found",
    });
  }

  res.status(200).json({
    success: true,
    data: section,
  });
});

// Update a section by ID
exports.updateSection = asyncErrorHandler(async (req, res, next) => {
  const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found",
    });
  }

  res.status(200).json({
    success: true,
    data: section,
  });
});

// Delete a section by ID
exports.deleteSection = asyncErrorHandler(async (req, res, next) => {
  const section = await Section.findByIdAndDelete(req.params.id);

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Section deleted successfully",
  });
});
