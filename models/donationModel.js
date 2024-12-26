const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Donor's name is required"],
  },
  email: {
    type: String,
    required: [true, "Donor's email is required"],
  },
  phone: {
    type: String,
    required: [true, "Donor's phone number is required"],
  },
  amount: {
    type: Number,
    required: [true, "Donation amount is required"],
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
    required: [true, "Beneficiary is required"],
  },
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
