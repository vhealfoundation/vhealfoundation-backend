const express = require('express');
const connectDatabase = require('./config/database');
const app = require('./app');
const PORT = process.env.PORT || 5000;



connectDatabase();


app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});


app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`)
})

