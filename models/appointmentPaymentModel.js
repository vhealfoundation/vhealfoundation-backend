const mongoose = require("mongoose");

const appointmentPaymentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User's name is required"],
  },
  userEmail: {
    type: String,
    required: [true, "User's email is required"],
  },
  userPhone: {
    type: String,
    required: [true, "User's phone number is required"],
  },
  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment is required"],
  },
  slotTime: {
    type: String,
    required: [true, "Slot time is required"],
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

const AppointmentPayment = mongoose.model("AppointmentPayment", appointmentPaymentSchema);

module.exports = AppointmentPayment;