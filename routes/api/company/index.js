const api = require('express').Router();
const companyRoutes = require('./companyRoutes');
const authRoutes = require('./authRoutes');
const addressRoutes = require('./addressRoutes');
const contactInfoRoutes = require('./contactInfoRoutes');

// /api/company
api.use("/address", addressRoutes);
api.use("/contact-info", contactInfoRoutes);
api.use('/', companyRoutes);
api.use('/', authRoutes);

module.exports = api;