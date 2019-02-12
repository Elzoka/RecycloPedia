const representative = require('express').Router();
const repRoutes = require('./repRoutes');

// /api/company
representative.use('/', repRoutes);

module.exports = representative;