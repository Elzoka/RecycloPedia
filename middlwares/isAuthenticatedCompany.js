const jwt = require('jsonwebtoken');
const config = require('../config');
const Company = require('../models/Company');

module.exports = (req, res, next) => {
    const token = req.headers['auth'];
    jwt.verify(token, config.JWT_SECRET,(err, decoded) => {
        if(err){
            return res.status(401).json({auth: false, message: 'Unauthorized'})
        }

        if(decoded.user === 'company'){
            Company.findOne({_id: decoded.id}, {_id: 1})
                .then((company) => {
                    if(!company){
                        return res.status(401).json({auth: false, message: 'UnAuthorized'});
                    }
                    req.companyId = company._id;
                    next();
                })
                .catch(err => {
                    res.status(401).json({auth: false, message: 'UnAuthorized'});
                });
        }
    });
}