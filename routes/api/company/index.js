const api = require('express').Router();
const companyRoutes = require('./companyRoutes');
const authRoutes = require('./authRoutes');

api.use(companyRoutes);
api.use(authRoutes);

module.exports = api;