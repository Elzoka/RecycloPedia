const company = require('express').Router();
const companyRoutes = require('./companyRoutes');
const authRoutes = require('./authRoutes');
const addressRoutes = require('./addressRoutes');
const contactInfoRoutes = require('./contactInfoRoutes');
const requestRoutes = require('./requestRoutes');

// /api/company
company.use("/address", addressRoutes);
company.use("/contact-info", contactInfoRoutes);
company.use('/request', requestRoutes);
company.use('/', companyRoutes);
company.use('/', authRoutes);

module.exports = company;