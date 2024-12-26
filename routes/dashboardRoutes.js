const express = require("express");
const router = express.Router();
const {
  getSummaryData,
  getMonthlyDonations,
  getCumulativeDonations,
  getDonationDistribution,
  getDonorBeneficiaryRatio,
} = require("../controllers/dashboardController");

router.get("/summary", getSummaryData);
router.get("/monthly-donations", getMonthlyDonations);
router.get("/cumulative-donations", getCumulativeDonations);
router.get("/donation-distribution", getDonationDistribution);
router.get("/donor-beneficiary-ratio", getDonorBeneficiaryRatio);

module.exports = router;
