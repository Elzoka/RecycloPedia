const authRoutes = require('express').Router();
const bcrypt = require('bcryptjs');

const Representative = require('../../../models/Representative');
const {createErrorObject} = require('../../../lib/errors');

// Auth

// @route  POST api/rep/login 
// @desc   login a rep
// @access Public

authRoutes.post('/login', (req, res) => {
    let response;

    let {username, password} = req.body;
    username = username && typeof username === 'string' ? username : null; 
    password = password && typeof password === 'string' ? password : null; 

    if(!username || !password){
        response = {auth: false, message: 'Invalid username or password'};

        return res.status(401).sendJson(response);
    }

    Representative
    .findOne({username}, {password: 1})
    .then(rep => {
        if(!rep){
            response = {auth: false, message: 'this username doesn\'t exist'};

            return res.status(404).sendJson(response);
        }
        return bcrypt
        .compare(password, rep.password)
        .then(result => {
            if(result){
                return rep
                .generateAuthToken()
                .then(token => {
                    response = {auth: true, token};

                    res.status(200).sendJson(response);
                })
            }else{
                response = {auth: false, message: 'Invalid username or password'};

                res.status(401).sendJson(response);
            }
        })
    })
    .catch(error => {
        // response = {auth: false, message: 'Internal Server Error'};
        // res.status(500).sendError(error, response);
        const errorObject = createErrorObject(error, true);
        res.status(errorObject.status).sendJson(errorObject.response);
                     
    })
});

module.exports = authRoutes;