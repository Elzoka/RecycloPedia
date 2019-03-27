const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const Item = require('../../../models/Item');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createRequestObj, updatedItemsFields} = require('../../../lib/request');

// @route  POST api/client/request 
// @desc   create a new request
// @access Private (client)

requestRoutes.post('/', isAuthenticatedClient, (req, res) => {
    let response;
    // validate request data
    const reqObj = createRequestObj(req.body, req.clientId);
    const itemsIds = reqObj.items.map(item => item.id);

    // check if the company exist and contains the specified items
    // if items returned then we trust that this company exists and has the filtered ids
    Item.find({
        _id: {$in: itemsIds},
        company: reqObj.company 
    },{
        _id: 1,
        company: 1
    })
    .then(trustedItems => {
        if(trustedItems.length < 1){
            response = {message: 'invalid data'};
            return res.status(400).sendJson(response);

        }
        const trustedIds = trustedItems.map(item => item._id.toHexString());

        // validate items
        reqObj.items = reqObj.items.filter(item => trustedIds.includes(item.id));
        reqObj.company = trustedItems[0].company; // any item company id will be the same
        reqObj.client = req.clientId;
        
        Request
            .create(reqObj)
            .then(newReq => {
                response = {request: newReq};
                res.status(200).sendJson(response);

            })
            .catch(error => {
                response = {
                    message: 'invalid data'
                };

                // @Todo handle errors better && log error object

                res.status(400).sendJson(response);
            });
    })
    .catch(error => {
        if(error.name === 'CastError'){
            response = {message: 'Invalid company or item Id'};
        
            return res.status(400).sendJson(response);
        }
        
        response = {
            message: 'internal server error'
        };

        res.status(500).sendError(error, response);       
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
        .select('-client')
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
                response = {message: 'Invalid Request Id'};
            
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
requestRoutes.put('/:id', isAuthenticatedClient, (req, res) => {
    let response;
    
    const reqObj = updatedItemsFields(req.body);

    const itemsIds = reqObj.items.map(item => item.id);

    // check specified items exists
    Item.find({
        _id: {$in: itemsIds}
    },{
        _id: 1,
        company: 1
    })
    .then(trustedItems => {
        if(trustedItems.length < 1){
            response = {message: 'invalid data'};
            return res.status(400).sendJson(response);
        }
        // any company id should work just fine cause all items should be form the same company
        const companyId = trustedItems[0].company;
        const trustedIds = trustedItems.map(item => {
            // check if each item has the same company to validate the previous assumption
            if(companyId && item.company !== companyId){
                companyId = null;
            }

            return item._id.toHexString()
        });


        // validate items
        reqObj.items = reqObj.items.filter(item => trustedIds.includes(item.id));
        

        // update only the request that macthes this three criteria _id, client, status and company provided
        Request.updateOne(
            {
                _id: req.params.id,
                client: req.clientId,
                company: companyId,
                status: 'sent'
            },
            {$set: reqObj}, // @TODO remove set and add push and pull to query for more efficiancy
            {runValidators: true}
        )
        .then(result => {
            // @TODO add 404 status code for result.n = 0;
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            if(error.name === 'ValidationError' || error.name === "CastError"){
                console.log(error.message);
                response = {message: "invalid request"};

                return res.status(400).sendJson(response)
            }

            response = {message: "Internal Server Error"};

            res.status(500).sendError(error, response);
        });
    })
    .catch(error => {
        if(error.name === 'CastError'){
            response = {message: 'Invalid item Id'};
        
            return res.status(400).sendJson(response);
        }
        
        response = {
            message: 'internal server error'
        };

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
            response = {message: 'Invalid Request Id'};
        
            return res.status(400).sendJson(response);
        }
        response = {message: "Internal Server Error"};

        res.status(500).sendError(error, response);
    });
});



module.exports = requestRoutes;