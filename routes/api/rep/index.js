const representative = require('express').Router();
const repRoutes = require('./repRoutes');
const authRoutes = require('./authRoutes');

// /api/company
representative.use('/', authRoutes);
representative.use('/', repRoutes);

module.exports = representative;