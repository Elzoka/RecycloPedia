const authRoutes = require('express').Router();
const bcrypt = require('bcryptjs');

const Company = require('../../../models/Company');
const log = require('../../../lib/log');

// Auth

// @route  POST api/company/login 
// @desc   login a Company
// @access Public

authRoutes.post('/login', (req, res) => {
    let statusCode;
    let response;

    let {email, password} = req.body; 
    email = email && typeof email === 'string' ? email : null; 
    password = password && typeof password === 'string' ? password : null; 

    if(!email || !password){
        statusCode = 401;
        response = {auth: false, message: 'Invalid email or password'};

        log(statusCode, response);
        return res.status(statusCode).json(response);
    }

    Company
    .findOne({email}, {password: 1})
    .then(company => {
        if(!company){
            statusCode = 404;
            response = {auth: false, message: 'this email doesn\'t exist'};

            log.response(statusCode, response);
            return res.status(statusCode).json(response);
        }
        return bcrypt
        .compare(password, company.password)
        .then(result => {
            if(result){
                return company
                .generateAuthToken()
                .then(token => {
                    statusCode = 200;
                    response = {auth: true, token};

                    log.response(statusCode, {
                        ...response,
                        token: !!token
                    })
                    res.status(statusCode).json(response);
                })
            }else{
                statusCode = 401;
                response = {auth: false, message: 'Invalid email or password'};

                log.response(statusCode, response);
                res.status(statusCode).json(response);
            }
        })
    })
    .catch(error => {
        statusCode = 500;
        response = {auth: false, message: 'Internal Server Error'};

        log.err(statusCode, {
            response,
            error
        });
        res.status(statusCode).json(response);              
    })
});

// @TODO add validate email route

module.exports = authRoutes;