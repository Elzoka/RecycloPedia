const clientRoutes = require('express').Router();

const Client = require('../../../models/Client');
const {createClientObject} = require('../../../lib/client');
// clientRoutes.get('/')



// @route  POST api/client 
// @desc   create a new client
// @access Public

clientRoutes.post('/', (req, res) => {
    // validate request data
    const clientObj = createClientObject(req.body);

    Client
        .create(clientObj)
        .then(newClient => {
            newClient
                .generateAuthToken()
                .then(token => {
                    response = {auth: true, token};
                    res.status(200).sendJson(response);
                })
                .catch(error => {
                    response = {
                        auth: false,
                        message: 'internal server error'
                    };

                    res.status(500).sendError(error, response);
                });
        })
        .catch(error => {
            response = {
                auth: false,
                message: 'invalid data'
            };

            res.status(400).sendJson(response);
        })
})

module.exports = clientRoutes;