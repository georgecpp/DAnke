const cron = require('node-cron');
const { morningGreet, afternoonRemind, rewardUsers } = require('./utils/cronjobs');
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// handle cron jobs for daily notifications system
cron.schedule("0 0 9 * * *", function () {
    morningGreet();
});
cron.schedule("0 0 16 * * *", function () {
    afternoonRemind();
});
cron.schedule("0 0 20 * * *", function () {
    rewardUsers();
});

// Import routes
const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const rewardRoute = require('./routes/reward');
const vitalsRoute = require('./routes/vitals');
const reactsRoute = require('./routes/reacts');

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
app.use('/reacts', reactsRoute);

app.listen(process.env.PORT || 8080, () => {
    console.log('Server Up and running!');
});