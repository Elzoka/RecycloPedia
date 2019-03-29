const clientRoutes = require('express').Router();

const Client = require('../../../models/Client');
const isAuthenticatedClient = require('../../../middlwares/isAuthenticatedClient');
const {createClientObject, updatedClientFields} = require('../../../lib/client');
const {createErrorObject} = require('../../../lib/errors');

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
                    const errorObject = createErrorObject(error, true, "try and login");
                    res.status(errorObject.status).sendJson(errorObject.response);
                });
        })
        .catch(error => {
            const errorObject = createErrorObject(error, true);
            res.status(errorObject.status).sendJson(errorObject.response);
        })
});


// @route  GET api/client 
// @desc   get clients
// @access Public @TODO (maybe only admins)

clientRoutes.get('/', (req, res) => {
    let response;
    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;

    // @TODO sort by location - name - createdAt - etc
    Client
    .find({}, {name: 1, phone: 1, rating: 1})
    .sort({name: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(clients => {
        response = {
            clients
        };

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
                    
        
        // response = {message: 'Internal Server error'};

        // res.status(500).sendError(error, response);
    })
});

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
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
                    
        // if(error.name === 'CastError'){
        //     response = {message: 'Invalid Client Id'};
        
        //     return res.status(400).sendJson(response);
        // }

        // response = {message: 'internal server error'};
        // res.status(500).sendError(error ,response);
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
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
                    
        // // code 11000 refers to duplicate key in email index
        // if(error.name === 'MongoError' && error.code === 11000){
        //     response = {
        //         message: 'email already exists'
        //     };

        //     return res.status(400).sendJson(response);
        // }

        // response = {message: "Internal Server Error"};

        // res.status(500).sendError(error, response);
    })
});

// @route  DELETE api/client
// @desc   delete client
// @access Private (client)
clientRoutes.delete('/', isAuthenticatedClient, (req, res) => {

    // @TODO create a transaction to remove all associated requests
    Client.deleteOne(
        {_id: req.clientId},
    )
    .then(result => {
        response = {result};

        res.status(200).sendJson(response)
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
    });
});

module.exports = clientRoutes;