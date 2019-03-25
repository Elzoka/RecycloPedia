const client = require('express').Router();

const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');
const addressRoutes = require('./addressRoutes');
const requestRoutes = require("./requestRoutes");

// /api/client
client.use('/address', addressRoutes);
client.use('/request', requestRoutes);
client.use('/', authRoutes);
client.use('/', clientRoutes);

module.exports = client;