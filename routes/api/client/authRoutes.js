const authRoutes = require('express').Router();
const bcrypt = require('bcryptjs');

const Client = require('../../../models/Client');
const {createErrorObject} = require('../../../lib/errors');

// Auth

// @route  POST api/client/login 
// @desc   login a Client
// @access Public

authRoutes.post('/login', (req, res) => {
    let response;

    let {email, password} = req.body; 
    email = email && typeof email === 'string' ? email : null; 
    password = password && typeof password === 'string' ? password : null; 

    if(!email || !password){
        response = {auth: false, message: 'Invalid email or password'};

        return res.status(401).sendJson(response);
    }

    Client
    .findOne({email}, {password: 1})
    .then(client => {
        if(!client){
            response = {auth: false, message: 'this email doesn\'t exist'};

            return res.status(404).sendJson(response);
        }
        return bcrypt
        .compare(password, client.password)
        .then(result => {
            if(result){
                return client
                .generateAuthToken()
                .then(token => {
                    response = {auth: true, token};

                    res.status(200).sendJson(response);
                })
            }else{
                response = {auth: false, message: 'Invalid email or password'};

                res.status(401).sendJson(response);
            }
        })
    })
    .catch(error => {
        errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
                    
        // response = {auth: false, message: 'Internal Server Error'};
        // res.status(500).sendError(error, response);              
    })
});

// @TODO add verify email route

module.exports = authRoutes;