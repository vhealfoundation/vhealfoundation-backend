const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

const sectionRoutes = require('./routes/sectionRoutes');
const aboutCardRoutes = require('./routes/aboutCardRoutes');
const storyRoutes = require("./routes/storyRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const donationRoutes = require("./routes/donationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


app.use('/api/v1', sectionRoutes);
app.use('/api/v1', aboutCardRoutes);
app.use('/api/v1', storyRoutes);
app.use('/api/v1', galleryRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', emailRoutes);
app.use('/api/v1', beneficiaryRoutes); 
app.use('/api/v1', donationRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', dashboardRoutes);

module.exports = app;
 