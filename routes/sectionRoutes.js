const express = require("express");
const {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

const router = express.Router();

router.route("/sections").post(createSection).get(getSections);
router
  .route("/sections/:id")
  .get(getSectionById)
  .put(updateSection)
  .delete(deleteSection);

module.exports = router;
