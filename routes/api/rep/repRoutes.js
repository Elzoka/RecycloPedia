const repRoutes = require('express').Router();

const Representative = require('../../../models/Representative');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const { createRepObject } = require('../../../lib/rep');

// @route  POST api/rep 
// @desc   create a new rep
// @access Private (company)

repRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // validate request data
    const repObj = createRepObject(req.body, req.companyId);
    Representative
        .create(repObj)
        .then(newRep => {
            newRep
                .generateAuthToken()
                .then(token => {
                    response = {auth: true, token};
                    res.status(200).sendJson(response);
                })
                .catch(error => {
                    response = {
                        auth: false,
                        message: 'internal server error' // @TODO if this error happens ask the user to try and login
                    };

                    res.status(500).sendError(error, response);
                });
        })
        .catch(error => {
            // code 11000 refers to duplicate key in email index
            if(error.name === 'MongoError' && error.code === 11000){
                response = {
                    auth: false,
                    message: 'username already exists'
                };

                return res.status(400).sendJson(response);
            }

            response = {
                auth: false,
                message: 'invalid data'
            };

            res.status(400).sendJson(response);
        });
});

// @route  GET api/company 
// @desc   get companies
// @access Public

repRoutes.get('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;

    Representative
    .find({company: req.companyId}, {username: 1, pic: 1, name: 1})
    .sort({username: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(representatives => {
        response = {
            representatives
        };

        res.status(200).sendJson(response);
    })
    .catch(error => {
        response = {message: 'Internal Server error'};

        res.status(500).sendError(error, response);
    })
});


module.exports = repRoutes;