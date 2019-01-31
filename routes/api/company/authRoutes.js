const authRoutes = require('express').Router();
const bcrypt = require('bcryptjs');

const Company = require('../../../models/Company');

// Auth

// @route  POST api/company/login 
// @desc   login a Company
// @access Public

authRoutes.post('/login', (req, res) => {
    const email = req.body.email && typeof req.body.email === 'string' ? req.body.email : null; 
    const password = req.body.password && typeof req.body.password === 'string' ? req.body.password : null; 

    if(!email || !password){
        return res.status(401).json({auth: false, message: 'Invalid email or password'});
    }

    Company
    .findOne({email}, {password: 1})
    .then(company => {
        if(!company){
            return res.status(404).json({auth: false, message: 'this email doesn\'t exist'});
        }
        bcrypt.compare(password, company.password)
        .then(result => {
            if(result){
                company.generateAuthToken()
                .then(token => {
                    res.status(200).json({auth: true, token});
                })
                .catch(err => {
                    res.status(500).json({auth: false, message: 'Internal Server Error'})  
                })
            }else{
                res.status(401).json({auth: false, message: 'Invalid email or password'});
            }
        })
        .catch(err => {
            res.status(500).json({auth: false, message: 'Internal Server Error'})  
        })
    })
    .catch(err => {
        res.status(500).json({auth: false, message: 'Internal Server Error'})              
    })
});

module.exports = authRoutes;