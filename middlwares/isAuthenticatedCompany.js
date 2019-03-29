const jwt = require('jsonwebtoken');
const config = require('../config');
const Company = require('../models/Company');
const {createErrorObject} = require('../lib/errors');


module.exports = (req, res, next) => {
    const token = req.headers['auth'];
    jwt.verify(token, config.JWT_COMPANY_SECRET,(err, decoded) => {
        if(err){
            response = {auth: false, message: 'Unauthorized'};
            return res.status(401).sendJson(response);
        }

        if(decoded.user === 'company'){
            Company.findOne({_id: decoded.id}, {_id: 1})
                .then((company) => {
                    if(!company){
                        response = {auth: false, message: 'UnAuthorized'};
                        return res.status(401).sendJson(response);
                    }
                    req.companyId = company._id;
                    next();
                })
                .catch(error => {
                    const errorObject = createErrorObject(error, true);
                    res.status(errorObject.status).sendJson(errorObject.response);
                });
        }else{
            // shouldn't reach here
            response = {auth: false, message: 'UnAuthorized'};
            res.status(401).sendJson(response);
        }

    });
}