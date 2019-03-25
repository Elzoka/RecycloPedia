const requestRoutes = require('express').Router();


const Request = require('../../../models/Request');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createRequestObj} = require('../../../lib/request');

// @route  POST api/request 
// @desc   create a new request
// @access Private (client)

requestRoutes.post('/', isAuthenticatedClient, (req, res) => {
    let response;
    // validate request data
    const reqObj = createRequestObj(req.body, req.clientId);
    Request
        .create(reqObj)
        .then(newReq => {
            response = {request: newReq};
            res.status(200).sendJson(response);

        })
        .catch(error => {
            response = {
                auth: false,
                message: 'invalid data'
            };

            // @Todo handle errors better && log error object

            res.status(400).sendJson(response);
        });
});

module.exports = requestRoutes;