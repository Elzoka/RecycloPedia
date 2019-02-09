const authRoutes = require('express').Router();
const bcrypt = require('bcryptjs');

const Company = require('../../../models/Company');

// Auth

// @route  POST api/company/login 
// @desc   login a Company
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

    Company
    .findOne({email}, {password: 1})
    .then(company => {
        if(!company){
            response = {auth: false, message: 'this email doesn\'t exist'};

            return res.status(404).sendJson(response);
        }
        return bcrypt
        .compare(password, company.password)
        .then(result => {
            if(result){
                return company
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
        response = {auth: false, message: 'Internal Server Error'};
        res.status(500).sendError(error, response);              
    })
});

// @TODO add validate email route

module.exports = authRoutes;