require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Configs and Middleware
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();
console.log('Attempting to connect to MongoDB...');

// Middleware
app.use(logger); // log events
app.use(credentials); // handle credential headers for CORS
app.use(cors(corsOptions)); // enable CORS
app.use(express.urlencoded({ extended: false })); // form data
app.use(express.json()); // json data
app.use('/', express.static(path.join(__dirname, '/public'))); // serve static files

// Routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/states')); // your GET-only states routes

// Catch-all 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Error handler
app.use(errorHandler);

// Only start the server if MongoDB connects
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
