const express = require("express");
const {
  createAppointmentOrder,
  verifyAppointmentPayment,
  getAppointmentPayments,
  updateAppointmentPaymentStatus,
} = require("../controllers/appointmentPaymentController");

const router = express.Router();

// Create appointment Razorpay order
router.post("/appointment-payments/order", createAppointmentOrder);

// Verify appointment Razorpay payment
router.post("/appointment-payments/verify", verifyAppointmentPayment);

// Retrieve all appointment payments (admin)
router.get("/appointment-payments", getAppointmentPayments);

// Update appointment payment status (admin)
router.put("/appointment-payments/:id", updateAppointmentPaymentStatus);

module.exports = router;