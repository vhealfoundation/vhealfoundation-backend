const express = require('express');
const connectDatabase = require('./config/database');
const app = require('./app');
const PORT = process.env.PORT || 5000;



connectDatabase();


app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});
app.get("/env-check", (req, res) => {
    res.json({
      donation_id: process.env.DONATION_RAZORPAY_KEY_ID,
      appointment_id: process.env.APPOINTMENT_RAZORPAY_KEY_ID,
    });
  });
  


app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`)
})

