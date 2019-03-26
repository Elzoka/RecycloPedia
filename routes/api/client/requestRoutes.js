const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createRequestObj, updatedItemsFields} = require('../../../lib/request');

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
        .select('company points createdAt status')
        .populate({
            path: 'company',
            select: 'name logo'
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


// @route  GET api/client/request/:id 
// @desc   get request by id
// @access private (client)

requestRoutes.get('/:id', isAuthenticatedClient,(req, res) => {
    let response;

    Request
        .findOne({
            client: req.clientId,
            _id: req.params.id
        })
        .populate({
            path: 'company',
            select: 'name logo rating'
        })
        .populate({
            path: 'representative',
            select: 'name pic'
        })
        .then(request => {
            response = {
                request
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            if(error.name === 'CastError'){
                response = {message: 'Invalid Plan Id'};
            
                return res.status(400).sendJson(response);
            }
            
            response = {
                message: 'internal server error'
            };

            res.status(500).sendError(error, response);            
        });
});


// @route  PUT api/client/request/:id
// @desc   update request
// @access Private (client)
requestRoutes.put('/:id', isAuthenticatedClient, async (req, res) => {
    let response;
    
    const updatedRequest = updatedItemsFields(req.body);
    
    Request.updateOne(
        {
            _id: req.params.id,
            client: req.clientId
        },
        {$set: updatedRequest},
        {runValidators: true}
    )
    .then(result => {
        // @TODO add 404 status code for result.n = 0;
        response = {result};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        if(error.name === 'ValidationError' || error.name === "CastError"){
            response = {message: "invalid request"};

            return res.status(400).sendJson(response)
        }

        response = {message: "Internal Server Error"};

        res.status(500).sendError(error, response);
    })
});

// @route  DELETE api/client/request/:id
// @desc   delete a request if not assigned
// @access Private (client)
requestRoutes.delete('/:id', isAuthenticatedClient, (req, res) => {

    Request.deleteOne(
        {
            _id: req.params.id,
            client: req.clientId,
            status: {$nin: ['assigned', 'fullfilled']}
        },
    )
    .then(result => {
        response = {result};

        res.status(200).sendJson(response)
    })
    .catch(error => {
        if(error.name === 'CastError'){
            response = {message: 'Invalid Plan Id'};
        
            return res.status(400).sendJson(response);
        }
        response = {message: "Internal Server Error"};

        res.status(500).sendError(error, response);
    });
});



module.exports = requestRoutes;