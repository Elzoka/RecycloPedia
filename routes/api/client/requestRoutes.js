const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createRequestObj} = require('../../../lib/request');

// @route  POST api/client/request 
// @desc   create a new request
// @access Private (client)

requestRoutes.post('/', isAuthenticatedClient, (req, res) => {
    let response;
    // validate request data
    const reqObj = createRequestObj(req.body, req.clientId);
    Request // @Todo check if the company has the specified items
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

// @route  GET api/client/request
// @desc   get client requests
// @access private (client)

requestRoutes.get('/', isAuthenticatedClient, (req, res) => {
    let response;

    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;
    
    Request
        .find({
            client: req.clientId
        })
        .populate({
            path: 'company',
            select: 'name logo'
        })
        .populate({
            path: 'representative',
            select: 'name pic'
        })
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .then(requests => {
            response = {
                requests
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            response = {
                message: 'internal server error'
            };

            res.status(500).sendError(error, response);            
        });
});


module.exports = requestRoutes;