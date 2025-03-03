const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  slots: {
    type: [
      {
        time: {
          type: String,
          required: [true, "Time is required"],
        },
        booked: {
          type: Boolean,
          default: false,
        },
        userDetails: {
          name: {
            type: String,
            default: "",
          },
          email: {
            type: String,
            default: "",
          },
          phone: {
            type: String,
            default: "",
          },
        },
        paymentStatus: {
          type: String,
          default: "pending",
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    validate: {
      validator: function (v) {
        return Array.isArray(v);
      },
      message: "Slots must be an array",
    },
    default: [],
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
