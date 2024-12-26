const AboutCard = require("../models/aboutCardModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a new about card
exports.createAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.create(req.body);

  res.status(201).json({
    success: true,
    data: aboutCard,
  });
});

// Get all about cards
exports.getAboutCards = asyncErrorHandler(async (req, res, next) => {
  const aboutCards = await AboutCard.find();

  res.status(200).json({
    success: true,
    data: aboutCards,
  });
});

// Get a single about card by ID
exports.getAboutCardById = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findById(req.params.id);

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "About card not found",
    });
  }

  res.status(200).json({
    success: true,
    data: aboutCard,
  });
});

// Update an about card by ID
exports.updateAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "About card not found",
    });
  }

  res.status(200).json({
    success: true,
    data: aboutCard,
  });
});

// Update a specific content item within an about card
exports.updateAboutCardContent = asyncErrorHandler(async (req, res, next) => {
  const { id, contentId } = req.params;

  const aboutCard = await AboutCard.findById(id);
  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "About card not found",
    });
  }

  const contentItem = aboutCard.content.id(contentId);
  if (!contentItem) {
    return res.status(404).json({
      success: false,
      message: "Content item not found",
    });
  }

  Object.assign(contentItem, req.body); // Update content fields
  await aboutCard.save();

  res.status(200).json({
    success: true,
    data: aboutCard,
  });
});

// Delete an about card by ID
exports.deleteAboutCard = asyncErrorHandler(async (req, res, next) => {
  const aboutCard = await AboutCard.findByIdAndDelete(req.params.id);

  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "About card not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "About card deleted successfully",
  });
});

// Delete a specific content item within an about card
exports.deleteAboutCardContent = asyncErrorHandler(async (req, res, next) => {
  const { id, contentId } = req.params;

  const aboutCard = await AboutCard.findById(id);
  if (!aboutCard) {
    return res.status(404).json({
      success: false,
      message: "About card not found",
    });
  }

  const contentItem = aboutCard.content.id(contentId);
  if (!contentItem) {
    return res.status(404).json({
      success: false,
      message: "Content item not found",
    });
  }

  contentItem.remove();
  await aboutCard.save();

  res.status(200).json({
    success: true,
    message: "Content item deleted successfully",
    data: aboutCard,
  });
});
