const Admin = require("../models/adminModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Check if an email is allowed
exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const admin = await Admin.findOne();

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin settings not found",
    });
  }

  const isAuthenticated = admin.allowedUsers.includes(email);

  res.status(200).json({
    success: true,
    isAuthenticated,
  });
});

// Add an email to the allowed users array
exports.addAllowedUser = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
  
    // Find the Admin document or create one if it doesn't exist
    let admin = await Admin.findOne();
  
    if (!admin) {
      admin = await Admin.create({ allowedUsers: [] }); // Initialize with an empty array
    }
  
    // Check if the email is already in the allowedUsers array
    if (admin.allowedUsers.includes(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in allowed users",
      });
    }
  
    // Add the new email to the array
    admin.allowedUsers.push(email);
    await admin.save();
  
    res.status(200).json({
      success: true,
      message: "Email added successfully",
      allowedUsers: admin.allowedUsers,
    });
  });
  

// Remove an email from the allowed users array
exports.removeAllowedUser = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const admin = await Admin.findOne();

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin settings not found",
    });
  }

  const index = admin.allowedUsers.indexOf(email);

  if (index === -1) {
    return res.status(400).json({
      success: false,
      message: "Email not found in allowed users",
    });
  }

  admin.allowedUsers.splice(index, 1);
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Email removed successfully",
    allowedUsers: admin.allowedUsers,
  });
});
