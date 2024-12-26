const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: [true, "Donor's name is required"],
  },
  donorEmail: {
    type: String,
    required: [true, "Donor's email is required"],
  },
  donorPhone: {
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
  razorpayOrderId: {
    type: String,
    required: [true, "Razorpay Order ID is required"],
  },
  razorpayPaymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
