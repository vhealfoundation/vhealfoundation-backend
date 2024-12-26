const express = require("express");
const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

const router = express.Router();

router.route("/stories").post(createStory).get(getStories);
router
  .route("/stories/:id")
  .get(getStoryById)
  .put(updateStory)
  .delete(deleteStory);

module.exports = router;
