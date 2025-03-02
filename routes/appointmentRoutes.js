const express = require("express");
const { getAppointments, bookAppointment, postAvailableDates, getAppointmentsByDate, editSlot  } = require("../controllers/appointmentController");

const router = express.Router();

router.get("/appointments", getAppointments);
router.post("/appointments/book", bookAppointment);
router.post("/appointments/dates", postAvailableDates);
router.get("/appointments/:date", getAppointmentsByDate);
router.put("/slots/:date/:slotId", editSlot);

module.exports = router;
