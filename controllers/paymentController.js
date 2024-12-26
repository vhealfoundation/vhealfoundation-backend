const Razorpay = require("razorpay");
const crypto = require('crypto');
const Payment = require("../models/paymentModel");
const Beneficiary = require("../models/beneficiaryModel");
const Donation = require("../models/donationModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order and save payment
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const { donorName, donorEmail, donorPhone, amount, beneficiaryId } = req.body;
 
  const beneficiaryExists = await Beneficiary.findById(beneficiaryId);
  if (!beneficiaryExists) {
    return res.status(404).json({
      success: false,
      message: "Beneficiary not found",
    });
  }

  // Create Razorpay order
  const options = {
    amount: amount * 100, // Amount in paise (Razorpay uses smallest currency unit)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Save payment details in the database
  const payment = await Payment.create({
    donorName,
    donorEmail,
    donorPhone,
    amount,
    beneficiary: beneficiaryId,
    razorpayOrderId: order.id,
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    payment,
  });
});

// Handle payment verification
exports.verifyPayment = asyncErrorHandler(async (req, res, next) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Find the payment record using the Razorpay order ID
  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  // Verify the Razorpay signature using the secret key
  const body = razorpayOrderId + "|" + razorpayPaymentId;  
  const secret = process.env.RAZORPAY_KEY_SECRET;  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpaySignature) {
    // If the signature matches, update payment status and return success
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.status = "Paid"; // Update payment status
    await payment.save();

     // Save details to the Donations collection
     const donation = await Donation.create({
      name: payment.donorName,
      email: payment.donorEmail,
      phone: payment.donorPhone,
      amount: payment.amount,
      beneficiary: payment.beneficiary._id,
      status: "Paid",
    });

    // Update the beneficiary's total amount
    const beneficiary = await Beneficiary.findById(payment.beneficiary._id);
    if (beneficiary) {
      beneficiary.amount_raised += payment.amount;
      await beneficiary.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } else {
    // Signature verification failed
    res.status(400).json({
      success: false,
      message: "Payment verification failed. Invalid signature.",
    });
  }
});

// Get all payments (admin view)
exports.getPayments = asyncErrorHandler(async (req, res, next) => {
  const payments = await Payment.find().populate("beneficiary", "name");

  res.status(200).json({
    success: true,
    data: payments,
  });
});

// Update payment status (for admin actions, if needed)
exports.updatePaymentStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;

  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});
