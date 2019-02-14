const plan = require('express').Router();

const planRoutes = require('./planRoutes');

// /api/plan
plan.use('/', planRoutes);

module.exports = plan;