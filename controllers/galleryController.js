const Gallery = require("../models/galleryModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Get the entire gallery with all categories
exports.getGallery = asyncErrorHandler(async (req, res, next) => {
  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ categories: [] }); // Create if not exist
  }

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

// Get images by category
exports.getGalleryByCategory = asyncErrorHandler(async (req, res, next) => {
  const { category } = req.params;

  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ categories: [] });
  }

  const categoryData = gallery.categories.find(
    cat => cat.title === category
  );

  if (!categoryData) {
    return res.status(404).json({
      success: false,
      message: `Category '${category}' not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: categoryData,
  });
});

// Add a new category if it doesn't exist
exports.addCategory = asyncErrorHandler(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Category title is required",
    });
  }

  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ categories: [] });
  }

  // Check if category already exists
  const categoryExists = gallery.categories.some(cat => cat.title === title);

  if (categoryExists) {
    return res.status(400).json({
      success: false,
      message: `Category '${title}' already exists`,
    });
  }

  gallery.categories.push({ title, images: [] });
  await gallery.save();

  res.status(201).json({
    success: true,
    data: gallery,
  });
});

// Add images to a specific category
exports.addImageToCategory = asyncErrorHandler(async (req, res, next) => {
  const { category } = req.params;
  const { images } = req.body; // Expect an array of { url, caption } objects

  if (!images || !Array.isArray(images)) {
    return res.status(400).json({
      success: false,
      message: "Images array is required",
    });
  }

  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ categories: [] });
  }

  // Find the category
  const categoryIndex = gallery.categories.findIndex(cat => cat.title === category);

  if (categoryIndex === -1) {
    // If category doesn't exist, create it
    gallery.categories.push({ title: category, images: [] });
    // Update the index to point to the newly created category
    const newIndex = gallery.categories.length - 1;
    gallery.categories[newIndex].images.push(...images);
  } else {
    // Add images to existing category
    gallery.categories[categoryIndex].images.push(...images);
  }

  await gallery.save();

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

// Delete a specific image from a category
exports.deleteImageFromCategory = asyncErrorHandler(async (req, res, next) => {
  const { category, imageId } = req.params;

  const gallery = await Gallery.findOne();

  if (!gallery) {
    return res.status(404).json({
      success: false,
      message: "Gallery not found",
    });
  }

  const categoryIndex = gallery.categories.findIndex(cat => cat.title === category);

  if (categoryIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Category '${category}' not found`,
    });
  }

  const categoryImages = gallery.categories[categoryIndex].images;
  const initialLength = categoryImages.length;

  gallery.categories[categoryIndex].images = categoryImages.filter(
    image => image._id.toString() !== imageId
  );

  if (initialLength === gallery.categories[categoryIndex].images.length) {
    return res.status(404).json({
      success: false,
      message: `Image with ID '${imageId}' not found in category '${category}'`,
    });
  }

  await gallery.save();

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

// Delete an entire category
exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const { category } = req.params;

  const gallery = await Gallery.findOne();

  if (!gallery) {
    return res.status(404).json({
      success: false,
      message: "Gallery not found",
    });
  }

  const initialLength = gallery.categories.length;

  gallery.categories = gallery.categories.filter(cat => cat.title !== category);

  if (initialLength === gallery.categories.length) {
    return res.status(404).json({
      success: false,
      message: `Category '${category}' not found`,
    });
  }

  await gallery.save();

  res.status(200).json({
    success: true,
    message: `Category '${category}' deleted successfully`,
    data: gallery,
  });
});

// Delete the entire gallery
exports.deleteGallery = asyncErrorHandler(async (req, res, next) => {
  const gallery = await Gallery.findOneAndDelete();

  if (!gallery) {
    return res.status(404).json({
      success: false,
      message: "Gallery not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Gallery deleted successfully",
  });
});
