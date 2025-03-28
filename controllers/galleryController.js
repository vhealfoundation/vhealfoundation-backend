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
  console.log('Starting addCategory with body:', req.body);
  const { title } = req.body;

  if (!title) {
    console.log('Category title missing in request');
    return res.status(400).json({
      success: false,
      message: "Category title is required",
    });
  }

  console.log('Searching for existing gallery...');
  let gallery = await Gallery.findOne();

  if (!gallery) {
    console.log('No gallery found, creating new gallery');
    gallery = await Gallery.create({ categories: [] });
  }

  console.log('Current gallery categories:', gallery.categories);
  // Check if category already exists
  const categoryExists = gallery.categories.some(cat => cat.title === title);

  if (categoryExists) {
    console.log(`Category '${title}' already exists`);
    return res.status(400).json({
      success: false,
      message: `Category '${title}' already exists`,
    });
  }

  console.log(`Adding new category: ${title}`);
  gallery.categories.push({ title, images: [] });
  await gallery.save();
  console.log('Gallery saved successfully');

  res.status(201).json({
    success: true,
    data: gallery,
  });
});

// Add images to a specific category
exports.addImageToCategory = asyncErrorHandler(async (req, res, next) => {
  console.log('Starting addImageToCategory with params:', req.params);
  console.log('Request body:', req.body);
  
  const { category } = req.params;
  const { images } = req.body;

  // Define allowed categories (matching the enum in galleryModel.js)
  const allowedCategories = [
    "COUNSELLING SERVICES",
    "ASSESSMENTS",
    "TRAINING",
    "COACHING",
    "REHABILITATION OF PRISONERS",
    "OTHER"
  ];

  // Validate category name
  if (!allowedCategories.includes(category)) {
    console.log(`Invalid category name: ${category}`);
    console.log('Allowed categories:', allowedCategories);
    return res.status(400).json({
      success: false,
      message: `Invalid category name. Must be one of: ${allowedCategories.join(', ')}`
    });
  }

  if (!images || !Array.isArray(images)) {
    console.log('Invalid images array in request:', images);
    return res.status(400).json({
      success: false,
      message: "Images array is required",
    });
  }

  console.log(`Attempting to add ${images.length} images to category: ${category}`);
  console.log('Image data:', images);

  let gallery = await Gallery.findOne();

  if (!gallery) {
    console.log('No gallery found, creating new gallery');
    gallery = await Gallery.create({ categories: [] });
  }

  console.log('Current gallery categories:', gallery.categories.map(cat => cat.title));
  // Find the category
  const categoryIndex = gallery.categories.findIndex(cat => cat.title === category);
  console.log('Category index:', categoryIndex);

  if (categoryIndex === -1) {
    console.log(`Category '${category}' not found, creating new category`);
    // If category doesn't exist, create it
    gallery.categories.push({ title: category, images: [] });
    // Update the index to point to the newly created category
    const newIndex = gallery.categories.length - 1;
    console.log('New category index:', newIndex);
    gallery.categories[newIndex].images.push(...images);
  } else {
    console.log(`Adding images to existing category at index ${categoryIndex}`);
    // Add images to existing category
    gallery.categories[categoryIndex].images.push(...images);
  }

  console.log('Saving gallery...');
  await gallery.save();
  console.log('Gallery saved successfully');

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
