const express = require("express");
const {
  createDonation,
  getDonations,
  updateDonationStatus,
  getDonationsByEmail
} = require("../controllers/donationController");

const router = express.Router();

// Create a donation
router.post("/donation", createDonation);

// Get all donations
router.get("/donation", getDonations);

// Get donations by user's email
router.get("/donation/:email", getDonationsByEmail);

// Update donation status
router.put("/donation/:id", updateDonationStatus);



module.exports = router;
