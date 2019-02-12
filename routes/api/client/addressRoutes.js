const addressRoutes = require('express').Router();
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createAddress} = require('../../../lib/address');
const Client = require('../../../models/Client');

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
            if(error.name === 'ValidationError' || error.name === "CastError"){
                response = {message: "invalid request"};

                return res.status(400).sendJson(response);
            }
            response = {message: "internal server error"};

            res.status(500).sendError(error, response);
        });
});


module.exports = addressRoutes;