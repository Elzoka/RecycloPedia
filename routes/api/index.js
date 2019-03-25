const express = require('express');
const api = express.Router();




// middleware
const logRequest = require('../../middlwares/logRequest');
const logResponse = require('../../middlwares/logResponse');

api.use(express.json());
api.use(logRequest);
api.use(logResponse);

// routes
const companyRoutes = require('./company');
const clientRoutes = require('./client');
const repRoutes = require('./rep');
const planRoutes = require('./plan');
const requestRoutes = require('./request');

api.use('/company', companyRoutes);
api.use('/client', clientRoutes);
api.use('/rep', repRoutes);
api.use('/plan', planRoutes);
api.use('/request', requestRoutes);

module.exports = api;