const express = require("express");
const {
  createBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

const router = express.Router();

// Create a new beneficiary
router.post("/beneficiary", createBeneficiary);

// Get all beneficiaries
router.get("/beneficiary", getBeneficiaries);

// Get a single beneficiary by ID
router.get("/beneficiary/:id", getBeneficiaryById);

// Update a beneficiary by ID
router.put("/beneficiary/:id", updateBeneficiary);

// Delete a beneficiary by ID
router.delete("/beneficiary/:id", deleteBeneficiary);

module.exports = router;
