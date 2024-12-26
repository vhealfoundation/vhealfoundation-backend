const express = require("express");
const {
  getGallery,
  addImageToGallery,
  deleteImageFromGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const router = express.Router();

// Get the gallery
router.route("/gallery").get(getGallery);

// Add a new image to the gallery
router.route("/gallery").post(addImageToGallery);

// Delete a specific image from the gallery
router.route("/gallery/:id").delete(deleteImageFromGallery);

// Delete the entire gallery
router.route("/gallery").delete(deleteGallery);

module.exports = router;
