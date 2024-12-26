const express = require("express");
const {
  createOrder,
  verifyPayment,
  getPayments,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay order
router.post("/payments/order", createOrder);

// Verify Razorpay payment
router.post("/payments/verify", verifyPayment);

// Get all payments (admin)
router.get("/payments", getPayments);

// Update payment status (admin)
router.put("/payments/:id", updatePaymentStatus);

module.exports = router;
