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

api.use('/company', companyRoutes);
api.use('/client', clientRoutes);

module.exports = api;