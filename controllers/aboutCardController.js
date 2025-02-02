const AboutCard = require("../models/aboutCardModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a new AboutCard
exports.createAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.create(req.body);

  res.status(201).json({
    success: true,
    data: aboutCard,
  });
});

// Get all AboutCards
exports.getAboutCards = asyncErrorHandler(async (req, res, next) => {
  const aboutCards = await AboutCard.find();

  res.status(200).json({
    success: true,
    data: aboutCards,
  });
});

// Get a single AboutCard by ID
exports.getAboutCardById = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findById(req.params.id);

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "AboutCard not found",
    });
  }

  res.status(200).json({
    success: true,
    data: aboutCard,
  });
});

// Update an AboutCard by ID
exports.updateAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "AboutCard not found",
    });
  }

  res.status(200).json({
    success: true,
    data: aboutCard,
  });
});

// Delete an AboutCard by ID
exports.deleteAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findByIdAndDelete(req.params.id);

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "AboutCard not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "AboutCard deleted successfully",
  });
});
