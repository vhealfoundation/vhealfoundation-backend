const express = require("express");
const { getAllSlots, getAppointments, getAllAppointmentDates, bookAppointment, postAvailableDates, getAppointmentsByDate, editSlot, editCompletedStatus , deleteSlot, getAppointmentByEmail  } = require("../controllers/appointmentController");

const router = express.Router();

router.get("/slots", getAllSlots);
router.get("/appointments", getAppointments);
router.post("/appointments/book", bookAppointment);
router.get("/appointments/dates", getAllAppointmentDates);
router.post("/appointments/dates", postAvailableDates);
router.get("/appointments/:date", getAppointmentsByDate);
router.get("/appointments/email/:email", getAppointmentByEmail);
router.put("/slots/:date/:slotId", editSlot);
router.put("/slots/:date/:slotId/completed", editCompletedStatus);
router.delete("/slots/:slotId", deleteSlot);

module.exports = router;
