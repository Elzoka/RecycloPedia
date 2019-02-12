const client = require('express').Router();

const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');
const addressRoutes = require('./addressRoutes');

// /api/client
client.use('/address', addressRoutes);
client.use('/', authRoutes);
client.use('/', clientRoutes);

module.exports = client;