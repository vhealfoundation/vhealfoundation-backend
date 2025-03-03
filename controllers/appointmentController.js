const Appointment = require("../models/appointmentsModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
// Get all appointments
exports.getAllSlots = asyncErrorHandler(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({ success: true, data: appointments });
})


exports.getAppointments = asyncErrorHandler(async (req, res, next) => {
  // Retrieve all appointments that contain at least one booked slot using lean for plain JS objects
  const appointments = await Appointment.find({ "slots.booked": true }).lean();

  // Extract booked slots and append the appointment's date to each slot
  let bookedSlots = [];
  appointments.forEach(appointment => {
    if (Array.isArray(appointment.slots)) {
      appointment.slots.forEach(slot => {
        if (slot.booked) {
          // Combine slot properties with the appointment date
          bookedSlots.push({ ...slot, date: appointment.date });
        }
      });
    }
  });

  console.log(bookedSlots);
  // Return the list of booked slot objects including their corresponding date
  res.status(200).json({ success: true, data: bookedSlots });
});

exports.getAllAppointmentDates = asyncErrorHandler(async (req, res, next) => {
  // Retrieve all appointments and extract only the date field
  const appointments = await Appointment.find({}, 'date').lean();
  // Remove duplicate dates by using a Set
  const dates = [...new Set(appointments.map(app => app.date))];
  // Return the array of unique appointment dates
  res.status(200).json({ success: true, data: dates });
});
// Book an appointment
exports.bookAppointment = asyncErrorHandler(async (req, res, next) => {
  const { date, slotId, userDetails, paymentStatus } = req.body;

  let slotEntry = await Appointment.findOne({ date });

  if (!slotEntry) {
    return res.status(404).json({ success: false, message: "No slots found for this date" });
  }

  let slot = slotEntry.slots.id(slotId);

  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found" });
  }

  if (slot.booked) {
    return res.status(400).json({ success: false, message: "Slot already booked" });
  }

  slot.booked = true;
  slot.userDetails = userDetails;
  slot.paymentStatus = paymentStatus;

  await slotEntry.save();

  res.status(200).json({ success: true, message: "Appointment booked successfully", slot });
});

// Post available dates and slots
exports.postAvailableDates = asyncErrorHandler(async (req, res, next) => {
  const { date, slots } = req.body;

  let slotEntry = await Appointment.findOne({ date });

  if (!slotEntry) {
    slotEntry = new Appointment({ date, slots });
  } else {
    const updatedSlots = slots.map(slot => {
      const existingSlot = slotEntry.slots.find(s => s.time === slot.time);
      return existingSlot ? { ...existingSlot.toObject(), ...slot } : slot;
    });

    slotEntry.slots = updatedSlots;
  }

  await slotEntry.save();
  res.status(201).json({ success: true, message: "Slots updated successfully", slot: slotEntry });
});

// Get appointments for a selected date
exports.getAppointmentsByDate = asyncErrorHandler(async (req, res, next) => {
  const { date } = req.params;

  let slotEntry = await Appointment.findOne({ date });

  if (slotEntry) {
    slotEntry.slots = slotEntry.slots.filter(slot => !slot.booked);
  }

  res.status(200).json({ success: true, slot: slotEntry || { date, slots: [], message: "No slots available" } });
});

exports.getAppointmentByEmail = asyncErrorHandler(async (req, res, next) => {
  // Assuming the email is passed as a route parameter (e.g. /appointments/email/:email)
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email parameter is required" });
  }

  // Find appointments where any slot contains the provided email in userDetails.email
  const appointments = await Appointment.find({ "slots.userDetails.email": email }).lean();

  // Extract the slots that match the provided email and include the appointment date
  let matchingSlots = [];
  appointments.forEach(appointment => {
    if (Array.isArray(appointment.slots)) {
      appointment.slots.forEach(slot => {
        if (slot.userDetails && slot.userDetails.email === email) {
          matchingSlots.push({ ...slot, date: appointment.date });
        }
      });
    }
  });

  // Return the matched slots with their corresponding appointment date
  res.status(200).json({ success: true, data: matchingSlots });
});

// Edit a slot (time) for a given date
exports.editSlot = asyncErrorHandler(async (req, res, next) => {
  const { date, slotId } = req.params;
  let { time, remove, userDetails, paymentStatus, completed } = req.body;

  console.log("Received Date:", date, "Slot ID:", slotId); // Debug log

  if (time && typeof time === "string") {
    time = time.trim(); // Trim the time string to avoid duplicates due to whitespace
  }

  // Ensure valid date format
  let formattedDate;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    formattedDate = date;
  } else {
    formattedDate = parsedDate.toISOString().split("T")[0];
  }

  console.log("Formatted date:", formattedDate);

  // Find or create the appointment entry
  let appointmentEntry = await Appointment.findOne({ date: formattedDate });

  if (!appointmentEntry) {
    appointmentEntry = new Appointment({ date: formattedDate, slots: [] });
  }

  if (slotId === "new" && time) { // Ensure 'time' is provided
    const duplicate = appointmentEntry.slots.some(slot => slot.time.trim() === time);
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Duplicate slot timing not allowed" });
    }

    const newSlot = {
      time,
      booked: false,
      userDetails: userDetails || { name: "", email: "", phone: "" },
      paymentStatus: paymentStatus || "pending",
      completed: completed ? completed.toString().toLowerCase() === "true" : false,
    };

    appointmentEntry.slots.push(newSlot);
    await appointmentEntry.save();

    console.log("New slot added:", newSlot);
    return res.status(200).json({ success: true, message: "Slot added successfully", slot: newSlot });
  }


  // If slotId is not "new", update or remove an existing slot
  const slot = appointmentEntry.slots.id(slotId);
  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found" });
  }

  if (remove) {
    appointmentEntry.slots.pull(slotId);
    await appointmentEntry.save();
    console.log("Slot removed. ID:", slotId);
    return res.status(200).json({ success: true, message: "Slot removed successfully" });
  }

  // Update existing slot
  slot.time = time || slot.time;
  slot.userDetails = userDetails || slot.userDetails;
  slot.paymentStatus = paymentStatus || slot.paymentStatus;
  slot.completed = completed ? completed.toString().toLowerCase() === "true" : slot.completed;

  await appointmentEntry.save();
  console.log("Slot updated:", slot);
  return res.status(200).json({ success: true, message: "Slot updated successfully", slot });
});

exports.editCompletedStatus = asyncErrorHandler(async (req, res, next) => {
  const { date, slotId } = req.params;
  const { completed } = req.body;

  console.log("Received Date:", date, "Slot ID:", slotId, "New Completed Status:", completed);

  // Ensure valid date format, if possible.
  let formattedDate;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    formattedDate = date;
    console.log("Using raw date value:", date);
  } else {
    formattedDate = parsedDate.toISOString().split("T")[0];
    console.log("Formatted date:", formattedDate);
  }

  // Find the appointment entry for the given date.
  let appointmentEntry = await Appointment.findOne({ date: formattedDate });
  if (!appointmentEntry) {
    return res.status(404).json({ success: false, message: "No appointment found for this date" });
  }

  // Find the slot by its id.
  const slot = appointmentEntry.slots.id(slotId);
  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found" });
  }

  // Update completed status, converting if needed.
  if (req.body.hasOwnProperty("completed")) {
    if (typeof completed === "string") {
      slot.completed = completed.toLowerCase() === "true";
    } else {
      slot.completed = completed;
    }
  }

  await appointmentEntry.save();
  console.log("Completed status updated for slot:", slot);
  return res.status(200).json({ success: true, message: "Completed status updated successfully", slot });
});



exports.deleteSlot = asyncErrorHandler(async (req, res, next) => {
  const { slotId } = req.params;

  // Find and delete the slot entry directly
  const deletedSlot = await Appointment.findByIdAndDelete(slotId);

  if (!deletedSlot) {
    return res.status(404).json({ success: false, message: "Slot not found" });
  }

  res.status(200).json({ success: true, message: "Slot deleted successfully" });
});