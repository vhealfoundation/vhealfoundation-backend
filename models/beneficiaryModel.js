const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  requirements: {
    type: [String],
    required: [true, "Requirements are required"],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "Requirements array cannot be empty",
    },
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  amount_raised: {
    type: Number,
    default: 0,
  },
});

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);

module.exports = Beneficiary;
