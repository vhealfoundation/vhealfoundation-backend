const express = require("express");
const {
  createAboutCard,
  getAboutCards,
  getAboutCardById,
  updateAboutCard,
  deleteAboutCard,
} = require("../controllers/aboutCardController");

const router = express.Router();

router.route("/aboutcards").post(createAboutCard).get(getAboutCards);
router
  .route("/aboutcards/:id")
  .get(getAboutCardById)
  .put(updateAboutCard)
  .delete(deleteAboutCard);

module.exports = router;
