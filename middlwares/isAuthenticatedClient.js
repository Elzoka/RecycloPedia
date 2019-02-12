const jwt = require('jsonwebtoken');
const config = require('../config');
const Client = require('../models/Client');

module.exports = (req, res, next) => {
    let response;
    const token = req.headers['auth'];
    jwt.verify(token, config.JWT_CLIENT_SECRET,(error, decoded) => {
        if(error){
            response = {auth: false, message: 'Unauthorized'};
            return res.status(401).sendJson(response);
        }

        if(decoded.user === 'client'){
            Client.findOne({_id: decoded.id}, {_id: 1})
                .then((client) => {
                    if(!client){
                        response = {auth: false, message: 'UnAuthorized'};
                        return res.status(401).sendJson(response);
                    }
                    req.clientId = client._id;
                    next();
                })
                .catch(error => {
                    response = {auth: false, message: 'internal server error'};
                    res.status(500).sendError(error, response);
                });
        }else{
            // shouldn't reach here
            response = {auth: false, message: 'UnAuthorized'};
            res.status(401).sendJson(response);
        }


    });
}