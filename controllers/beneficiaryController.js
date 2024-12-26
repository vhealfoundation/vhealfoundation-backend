const Beneficiary = require("../models/beneficiaryModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Create a new beneficiary
exports.createBeneficiary = asyncErrorHandler(async (req, res, next) => {
  const { name, age, requirements, image, description } = req.body;

  const beneficiary = await Beneficiary.create({
    name,
    age,
    requirements,
    image,
    description,
  });

  res.status(201).json({
    success: true,
    data: beneficiary,
  });
});

// Get all beneficiaries
exports.getBeneficiaries = asyncErrorHandler(async (req, res, next) => {
  const beneficiaries = await Beneficiary.find();

  res.status(200).json({
    success: true,
    data: beneficiaries,
  });
});

// Get a single beneficiary by ID
exports.getBeneficiaryById = asyncErrorHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findById(req.params.id);

  if (!beneficiary) {
    return res.status(404).json({
      success: false,
      message: "Beneficiary not found",
    });
  }

  res.status(200).json({
    success: true,
    data: beneficiary,
  });
});

// Update a beneficiary by ID
exports.updateBeneficiary = asyncErrorHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!beneficiary) {
    return res.status(404).json({
      success: false,
      message: "Beneficiary not found",
    });
  }

  res.status(200).json({
    success: true,
    data: beneficiary,
  });
});

// Delete a beneficiary by ID
exports.deleteBeneficiary = asyncErrorHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);

  if (!beneficiary) {
    return res.status(404).json({
      success: false,
      message: "Beneficiary not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Beneficiary deleted successfully",
  });
});
