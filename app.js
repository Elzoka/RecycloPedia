const express = require('express');

const app = express();

// connect to the database
require('./db');

// Routes
const routes = require('./routes');
app.use('/', routes);

module.exports = app;