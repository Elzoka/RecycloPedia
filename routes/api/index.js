const express = require('express');
const api = express.Router();
const companyRoutes = require('./company');
const logData = require('../../middlwares/logData');

// middleware
api.use(express.json());
api.use(logData);
api.use('/company', companyRoutes);

module.exports = api;