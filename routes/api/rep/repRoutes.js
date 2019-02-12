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
        })
});

module.exports = repRoutes;