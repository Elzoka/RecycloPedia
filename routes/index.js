const routes = require('express').Router();
const api = require('./api');

routes.use('/api', api);

module.exports = routes;