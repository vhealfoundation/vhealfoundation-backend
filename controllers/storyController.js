const Story = require("../models/storyModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a new story
exports.createStory = asyncErrorHandler(async (req, res, next) => {
  const story = await Story.create(req.body);

  res.status(201).json({
    success: true,
    data: story,
  });
});

// Get all stories
exports.getStories = asyncErrorHandler(async (req, res, next) => {
  const stories = await Story.find();

  res.status(200).json({
    success: true,
    data: stories,
  });
});

// Get a single story by ID
exports.getStoryById = asyncErrorHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Story not found",
    });
  }

  res.status(200).json({
    success: true,
    data: story,
  });
});

// Update a story by ID
exports.updateStory = asyncErrorHandler(async (req, res, next) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Story not found",
    });
  }

  res.status(200).json({
    success: true,
    data: story,
  });
});

// Delete a story by ID
exports.deleteStory = asyncErrorHandler(async (req, res, next) => {
  const story = await Story.findByIdAndDelete(req.params.id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Story not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Story deleted successfully",
  });
});
