const api = require('express').Router();
const companyRoutes = require('./companyRoutes');
const authRoutes = require('./authRoutes');
const addressRoutes = require('./addressRoutes');

// /api/company
api.use('/', companyRoutes);
api.use('/', authRoutes);
api.use("/address", addressRoutes);

module.exports = api;