const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  allowedUsers: {
    type: [String], // Array of strings for allowed emails
    validate: {
      validator: function (v) {
        // Only validate non-empty array for existing documents
        return Array.isArray(v);
      },
      message: "Allowed users must be an array",
    },
    default: [], // Initialize with an empty array
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
