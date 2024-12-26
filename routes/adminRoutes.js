const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  addAllowedUser,
  removeAllowedUser,
} = require("../controllers/adminController");

// Route to check if an email is authenticated
router.post("/admin/is-authenticated", isAuthenticated);

// Route to add an allowed user
router.post("/admin/add-user", addAllowedUser);

// Route to remove an allowed user
router.post("/admin/remove-user", removeAllowedUser);

module.exports = router;
