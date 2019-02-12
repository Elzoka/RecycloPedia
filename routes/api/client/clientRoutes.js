const clientRoutes = require('express').Router();

const Client = require('../../../models/Client');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createClientObject, updatedClientFields} = require('../../../lib/client');
// clientRoutes.get('/')



// @route  POST api/client 
// @desc   create a new client
// @access Public

clientRoutes.post('/', (req, res) => {
    let response;
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
            // code 11000 refers to duplicate key in email index
            if(error.name === 'MongoError' && error.code === 11000){
                response = {
                    auth: false,
                    message: 'email already exists'
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


// @TODO {

// @route  GET api/client 
// @desc   create a new client
// @access Public

// }

// @route  GET api/client:id 
// @desc   get client by id
// @access Public

clientRoutes.get('/:id', (req, res) => {
    let response;
    const clientId = req.params.id;

    Client
    .findOne(
        {_id: clientId},
        {
            // @TODO Change projected data
            requests: 0,
            email: 0,
            password: 0,
        }
    )
    .then(client => {
        if(!client){
            response = {message: 'Client not found'};

            return res.status(404).sendJson(response);
        }
        response = {client};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        if(error.name === 'CastError'){
            response = {message: 'Invalid Client Id'};
        
            return res.status(400).sendJson(response);
        }

        response = {message: 'internal server error'};
        res.status(500).sendError(error ,response);
    })
});

// @route  PUT api/client
// @desc   update client
// @access Private (client)
clientRoutes.put('/', isAuthenticatedClient, (req, res) => {
    let response;
    
    const updatedClientObject = updatedClientFields(req.body);
    Client.updateOne(
        {_id: req.clientId},
        {$set: updatedClientObject},
        {runValidators: true}
    )
    .then(result => {
        // @TODO add 404 status code for result.n = 0;
        response = {result};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        // code 11000 refers to duplicate key in email index
        if(error.name === 'MongoError' && error.code === 11000){
            response = {
                message: 'email already exists'
            };

            return res.status(400).sendJson(response);
        }

        response = {message: "Internal Server Error"};

        res.status(500).sendError(error, response);
    })
});

// @route  DELETE api/client
// @desc   delete client
// @access Private (client)
clientRoutes.delete('/', isAuthenticatedClient, (req, res) => {

    // @TODO create a transaction to remove all associated reps and requests
    Client.deleteOne(
        {_id: req.clientId},
    )
    .then(result => {
        response = {result};

        res.status(200).sendJson(response)
    })
    .catch(error => {
        response = {message: "Internal Server Error"};

        res.status(500).sendError(error, response);
    });
});

module.exports = clientRoutes;