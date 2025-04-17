const Razorpay = require("razorpay");
const crypto = require("crypto");
const AppointmentPayment = require("../models/appointmentPaymentModel");
const Appointment = require("../models/appointmentsModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.APPOINTMENT_RAZORPAY_KEY_ID,
  key_secret: process.env.APPOINTMENT_RAZORPAY_KEY_SECRET,
});


/**
 * Create a Razorpay order for an appointment payment and save the appointment payment details.
 */
exports.createAppointmentOrder = asyncErrorHandler(async (req, res, next) => {
  // Destructure required fields from request body
  const { userName, userEmail, userPhone, amount, appointmentId, slotTime } = req.body;

  // Find the appointment by ID
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check that the specified slot exists and is not already booked
  const slotIndex = appointment.slots.findIndex(
    (slot) => slot.time === slotTime && !slot.booked
  );
  if (slotIndex === -1) {
    return res.status(400).json({
      success: false,
      message: "Slot is either unavailable or already booked",
    });
  }

  // Create Razorpay order. Amount multiplied by 100 for currency subunit.
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Create the appointment payment record in the database
  const appointmentPayment = await AppointmentPayment.create({
    userName,
    userEmail,
    userPhone,
    amount,
    appointment: appointmentId,
    slotTime,
    razorpayOrderId: order.id,
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    appointmentPayment,
  });
});

/**
 * Verify the Razorpay signature for an appointment payment,
 * update payment status, and mark the appointment slot as booked.
 */
exports.verifyAppointmentPayment = asyncErrorHandler(async (req, res, next) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Find the appointment payment record using the Razorpay order ID
  const appointmentPayment = await AppointmentPayment.findOne({ razorpayOrderId });
  if (!appointmentPayment) {
    return res.status(404).json({
      success: false,
      message: "Appointment payment not found",
    });
  }

  // Verify the Razorpay signature using the secret key
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const secret = process.env.APPOINTMENT_RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpaySignature) {
    // Update appointment payment record as paid
    appointmentPayment.razorpayPaymentId = razorpayPaymentId;
    appointmentPayment.status = "Paid";
    await appointmentPayment.save();

    // Mark the corresponding appointment slot as booked
    const appointment = await Appointment.findById(appointmentPayment.appointment);
    if (appointment) {
      const slot = appointment.slots.find(
        (slot) => slot.time === appointmentPayment.slotTime && !slot.booked
      );
      if (slot) {
        slot.booked = true;
        slot.paymentStatus = "Paid";
        slot.userDetails = {
          name: appointmentPayment.userName,
          email: appointmentPayment.userEmail,
          phone: appointmentPayment.userPhone,
        };
      }
      await appointment.save();
    }

    // Email Content for User
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #003153; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: #fff; margin: 0;">Appointment Confirmed!</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${appointmentPayment.userName}</strong>,</p>
            <p style="font-size: 16px; color: #555;">
              Your appointment has been successfully booked.
            </p>
            <p style="font-size: 16px; color: #555;">
              <strong>Appointment Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-GB')} <br>
              <strong>Time Slot:</strong> ${appointmentPayment.slotTime} <br>
              <strong>Transaction ID:</strong> ${razorpayPaymentId} <br>
              <strong>Amount Paid:</strong> ₹${appointmentPayment.amount}
            </p>
            <p style="font-size: 16px; color: #555;">
              Thank you for choosing our services. If you have any questions, feel free to reach out.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://vhealfoundation.org/"
                 style="background-color: #003153; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Visit Our Website
              </a>
            </div>
          </div>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="font-size: 14px; color: #777; margin: 0;">
              If you have any questions, feel free to <a href="mailto:vhealfoundation@gmail.com" style="color: #003153; text-decoration: none;">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    `;

    // Email Content for Admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #003153; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: #fff; margin: 0;">New Appointment Booking</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Dear Admin,</p>
            <p style="font-size: 16px; color: #555;">
              A new appointment has been booked.
            </p>
            <p style="font-size: 16px; color: #555;">
              <strong>User:</strong> ${appointmentPayment.userName} <br>
              <strong>Email:</strong> ${appointmentPayment.userEmail} <br>
              <strong>Phone:</strong> ${appointmentPayment.userPhone} <br>
              <strong>Appointment Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-GB')} <br>
              <strong>Time Slot:</strong> ${appointmentPayment.slotTime} <br>
              <strong>Transaction ID:</strong> ${razorpayPaymentId} <br>
              <strong>Amount Paid:</strong> ₹${appointmentPayment.amount}
            </p>
            <p style="font-size: 16px; color: #555;">
              Please review the appointment details in the admin panel.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://vhealfoundationsadmin.web.app/login"
                 style="background-color: #003153; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Admin Dashboard
              </a>
            </div>
          </div>
         
        </div>
      </div>
    `;

    // Send email to the user
    await sendEmail({
      email: appointmentPayment.userEmail,
      subject: "Your Appointment is Confirmed",
      message: userEmailContent,
    });

    // Send email to the admin
    await sendEmail({
      email: "vhealfoundation@gmail.com",
      subject: "New Appointment Booking",
      message: adminEmailContent,
    });

    res.status(200).json({
      success: true,
      message: "Appointment payment verified successfully. Emails sent.",
      appointmentPayment,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed. Invalid signature.",
    });
  }
});

/**
 * Retrieve all appointment payments. Intended for admin use.
 */
exports.getAppointmentPayments = asyncErrorHandler(async (req, res, next) => {
  const payments = await AppointmentPayment.find().populate("appointment", "date slots");

  res.status(200).json({
    success: true,
    data: payments,
  });
});

/**
 * Update appointment payment status (admin action).
 */
exports.updateAppointmentPaymentStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;

  const appointmentPayment = await AppointmentPayment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!appointmentPayment) {
    return res.status(404).json({
      success: false,
      message: "Appointment payment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: appointmentPayment,
  });
});

