const routes = require('express').Router();
const api = require('./api');
const log = require('../lib/log');

routes.use('/api', api);
routes.all('*', (req, res) => {
    statusCode = 404;
    response = {message: `${req.method} ${req.path} doesn't exist`};

    log.response(statusCode, response);
    res.status(statusCode).json(response);
})
module.exports = routes;