const express = require("express");
const {
  getGallery,
  getGalleryByCategory,
  addCategory,
  addImageToCategory,
  updateImageCaption,
  deleteImageFromCategory,
  deleteCategory,
  deleteGallery,
} = require("../controllers/galleryController");

const router = express.Router();

// Get the entire gallery with all categories
router.route("/gallery").get(getGallery);

// Get images by category
router.route("/gallery/category/:category").get(getGalleryByCategory);

// Add a new category
router.route("/gallery/category").post(addCategory);

// Add images to a specific category
router.route("/gallery/category/:category/images").post(addImageToCategory);

// Update image caption in a category
router.route("/gallery/category/:category/image/:imageId/caption")
  .put(updateImageCaption);

// Delete a specific image from a category
router.route("/gallery/category/:category/image/:imageId").delete(deleteImageFromCategory);

// Delete an entire category
router.route("/gallery/category/:category").delete(deleteCategory);

// Delete the entire gallery
router.route("/gallery").delete(deleteGallery);

module.exports = router;
