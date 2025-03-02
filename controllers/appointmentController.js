const Appointment = require("../models/appointmentsModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Get all appointments
exports.getAppointments = asyncErrorHandler(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({ success: true, data: appointments });
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

// Edit a slot (time) for a given date
exports.editSlot = asyncErrorHandler(async (req, res, next) => {
    const { date, slotId } = req.params;
    const { time } = req.body;

    console.log("Received Date:", date, "Slot ID:", slotId); // Debugging log

    // Ensure the date format is consistent
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Find the appointment entry by date
    let slotEntry = await Appointment.findOne({ date: formattedDate });

    if (!slotEntry) {
        return res.status(404).json({ success: false, message: "No slots found for this date" });
    }

    console.log("Slot Entry Found:", slotEntry); // Debugging log

    // Find the specific slot by ID
    let slot = slotEntry.slots.id(slotId);

    if (!slot) {
        return res.status(404).json({ success: false, message: "Slot not found" });
    }

    // Update the slot time
    slot.time = time;
    await slotEntry.save();

    res.status(200).json({ success: true, message: "Slot updated successfully", slot });
});

