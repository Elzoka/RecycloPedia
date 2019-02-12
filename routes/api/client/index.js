const client = require('express').Router();

const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');

// /api/client
client.use('/', authRoutes);
client.use('/', clientRoutes);

module.exports = client;