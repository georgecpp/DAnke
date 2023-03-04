const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


// Import routes
const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const rewardRoute = require('./routes/reward');
const vitalsRoute = require('./routes/vitals');

// Connect to DB  -- implement.
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('connected to db!')
});

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

// Route Middlewares
app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/reward', rewardRoute);
app.use('/vitals', vitalsRoute);

app.listen(process.env.PORT || 8080, () => {
    console.log('Server Up and running!');
});