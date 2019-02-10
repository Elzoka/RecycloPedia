const client = require('express').Router();

const clientRoutes = require('./clientRoutes');

// /api/client
client.use('/', clientRoutes);

module.exports = client;