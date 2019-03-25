const request = require('express').Router();

const requestRoutes = require('./requestRoutes');

request.use('/', requestRoutes);

module.exports = request;