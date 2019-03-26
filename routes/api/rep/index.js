const representative = require('express').Router();
const repRoutes = require('./repRoutes');
const authRoutes = require('./authRoutes');
const requestRoutes = require('./requestRoutes');

// /api/rep
representative.use('/request', requestRoutes);
representative.use('/', authRoutes);
representative.use('/', repRoutes);

module.exports = representative;