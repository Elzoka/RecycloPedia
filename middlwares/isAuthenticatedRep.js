const jwt = require('jsonwebtoken');
const config = require('../config');
const Representative = require('../models/Representative');
const {createErrorObject} = require('../lib/errors');


module.exports = (req, res, next) => {
    const token = req.headers['auth'];
    jwt.verify(token, config.JWT_REP_SECRET,(err, decoded) => {
        if(err){
            response = {auth: false, message: 'Unauthorized'};
            return res.status(401).sendJson(response);
        }

        if(decoded.user === 'rep'){
            Representative.findOne({_id: decoded.id}, {_id: 1})
                .then((representative) => {
                    if(!representative){
                        response = {auth: false, message: 'UnAuthorized'};
                        return res.status(401).sendJson(response);
                    }
                    req.repId = representative._id;
                    next();
                })
                .catch(error => {
                    const errorObject = createErrorObject(error, true, "try and login");
                    res.status(errorObject.status).sendJson(errorObject.response);
                });
        }else{
            // shouldn't reach here
            response = {auth: false, message: 'UnAuthorized'};
            res.status(401).sendJson(response);
        }

    });
}