const addressRoutes = require('express').Router();
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createAddress, updatedAddressField} = require('../../../lib/address');
const Client = require('../../../models/Client');
const {createErrorObject} = require('../../../lib/errors');


// @route  POST api/client/address 
// @desc   add new address
// @access Private

addressRoutes.post('/', isAuthenticatedClient, (req, res) => {
    // let statusCode;
    let response;
    // @TODO limit the max size of addresses array to 10
    const address = createAddress(req.body);

    Client
        .updateOne(
            {_id: req.clientId},
            {$addToSet: { address }},
            {runValidators: true}
        )
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
                    
            // if(error.name === 'ValidationError' || error.name === "CastError"){
            //     response = {message: "invalid request"};

            //     return res.status(400).sendJson(response);
            // }
            // response = {message: "internal server error"};

            // res.status(500).sendError(error, response);
        });
});


// @route  PUT api/client/address 
// @desc   update existing address
// @access Private

addressRoutes.put('/:id', isAuthenticatedClient,(req, res) => {
    let response;
    const addressFields = updatedAddressField(req.body);
    const toUpdateKeys = Object.keys(addressFields);

    // create query 
    const setQuery = {};
    toUpdateKeys.forEach(key => {
        setQuery[`address.$.${key}`] = addressFields[key];
    });
    Client.updateOne(
            {_id: req.clientId, "address._id": req.params.id},
            {$set: setQuery},
        )
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
                    

            // if(error.name === 'ValidationError' || error.name === "CastError"){
            //     response = {message: "invalid request"};

            //     return res.status(400).sendJson(response)
            // }

            // response = {message: "internal server error"};
            // res.status(500).sendError(error, response);
        });
});

// @route  DELETE api/client/address 
// @desc   delete existing address
// @access Private

addressRoutes.delete("/:id", isAuthenticatedClient, (req, res) => {
    let response;
    Client
        .updateOne({_id: req.clientId}, {$pull: {address: {_id: req.params.id}}})
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            // if(error.name === 'ValidationError' || error.name === "CastError"){
            //     response = {message: "invalid request"};

            //     return res.status(400).sendJson(response)
            // }

            // response = {message: "internal server error"};
            // res.status(500).sendError(error, response);
            
            errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
                    
        });
});


module.exports = addressRoutes;