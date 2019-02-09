const express = require('express');
const api = express.Router();
const companyRoutes = require('./company');
const logRequest = require('../../middlwares/logRequest');
const updateResponse = require('../../middlwares/updateResponse');

// middleware
api.use(express.json());
api.use(logRequest);
api.use(updateResponse);
api.use('/company', companyRoutes);

module.exports = api;