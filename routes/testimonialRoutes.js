const express = require("express");
const {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

router.route("/testimonials").post(createTestimonial).get(getTestimonials);
router
  .route("/testimonials/:id")
  .get(getTestimonialById)
  .put(updateTestimonial)
  .delete(deleteTestimonial);

module.exports = router;