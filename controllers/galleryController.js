const Gallery = require("../models/galleryModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Get the gallery
exports.getGallery = asyncErrorHandler(async (req, res, next) => {
  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ images: [] }); // Create if not exist
  }

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

// Add a new image to the gallery
exports.addImageToGallery = asyncErrorHandler(async (req, res, next) => {
  const { images } = req.body; // Expect an array of { url } objects

  let gallery = await Gallery.findOne();

  if (!gallery) {
    gallery = await Gallery.create({ images: [] }); // Create if not exist
  }

  // Add each image's URL to the gallery
  gallery.images.push(...images); // Spread the array of objects

  await gallery.save();

  res.status(200).json({
    success: true,
    data: gallery,
  });
});


// Delete a specific image from the gallery
exports.deleteImageFromGallery = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const gallery = await Gallery.findOne();

  if (!gallery) {
    return res.status(404).json({
      success: false,
      message: "Gallery not found",
    });
  }

  gallery.images = gallery.images.filter((image) => image._id.toString() !== id);
  await gallery.save();

  res.status(200).json({
    success: true,
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
