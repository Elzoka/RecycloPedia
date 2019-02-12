const log = require('../lib/log');
module.exports = (req, res, next) => { 
    // collect data
    const data = {};
    data.method = req.method;
    data.ip = req.connection.remoteAddress;
    data.path = req.originalUrl;
    data.body = {...req.body}; // make a copy to change
    data.query = req.query;
    data.params = req.params;
    data.headers = {...req.headers, "auth": !!req.get("auth")};

    if(data.body && data.body.password){
        data.body.password = true;
    }
    
    // log request
    log.request(data);

    next()
}