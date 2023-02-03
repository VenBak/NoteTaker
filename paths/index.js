const express = require('express');
const app = express();

// Adds the other route
const route2 = require('./api');

// redirects path to notes if user goes beyong /notes
app.use('/notes', route2);

// exports the modules
module.exports = app;
