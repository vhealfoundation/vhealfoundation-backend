const Donation = require("../models/donationModel");
const Beneficiary = require("../models/beneficiaryModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a donation
exports.createDonation = asyncErrorHandler(async (req, res, next) => {
  const { name, email, phone, amount, beneficiary } = req.body;

  const beneficiaryExists = await Beneficiary.findById(beneficiary);
  if (!beneficiaryExists) {
    return res.status(404).json({
      success: false,
      message: "Beneficiary not found",
    });
  }

  const donation = await Donation.create({
    name,
    email,
    phone,
    amount,
    beneficiary,
  });

  res.status(201).json({
    success: true,
    data: donation,
  });
});

// Get all donations
exports.getDonations = asyncErrorHandler(async (req, res, next) => {
  const donations = await Donation.find().populate("beneficiary", "name");

  res.status(200).json({
    success: true,
    data: donations,
  });
});

// Update donation status
exports.updateDonationStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;

  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!donation) {
    return res.status(404).json({
      success: false,
      message: "Donation not found",
    });
  }

  res.status(200).json({
    success: true,
    data: donation,
  });
});


// Get donations by user's email
exports.getDonationsByEmail = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.params;

  const donations = await Donation.find({ email }).populate("beneficiary", "name image");

  if (donations.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No donations found for this email",
    });
  }

  res.status(200).json({
    success: true,
    data: donations,
  });
});
