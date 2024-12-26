const express = require("express");
const { sendCustomEmail } = require("../controllers/emailController");
const router = express.Router();

// Route to send an email
router.post("/send", sendCustomEmail);

module.exports = router;
