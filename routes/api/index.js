const express = require('express');
const api = express.Router();
const companyRoutes = require('./company');

api.use(express.json());
api.use('/company', companyRoutes);

module.exports = api;