const log = require('../lib/log');
module.exports = (req, res, next) => { 
    // collect data
    const data = {};
    data.method = req.method;
    data.ip = req.connection.remoteAddress;
    data.path = req.originalUrl;
    data.body = req.body ? {...req.body, password: undefined} : null;

    // log request
    log.request(data);
    next()
}