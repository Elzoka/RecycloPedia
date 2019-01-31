const companyRoutes = require('express').Router();
const bcrypt = require('bcryptjs');


const Company = require('../../models/Company');
const {createCompanyObject} = require('../../lib/company');
const isLoggedIn = require('../../middlwares/isLoggedIn');

// @@@@@ TODO ===>  ADD SUITABLE ERROR MESSAGES

// @route  POST api/company 
// @desc   Create new Company 
// @access Public

companyRoutes.post('/', (req, res) => {
    const companyObj = createCompanyObject(req.body);
    const company = new Company(companyObj);

    // validate the company
    company
    .validate()
    .then(() => {
        // if valid save it
        company
        .save()
        .then(savedCompany => {
            // return token to user
            savedCompany.generateAuthToken()
                .then(token => {
                    res.status(200).send({auth: true, token, company: savedCompany});
                })
                .catch(e => {
                    res.status(500).send({auth: false, error: e});
                });
        })
        .catch(e => {
            res.status(500).send({auth: false, error: e});
        });
    })
    .catch(err => {
        res.status(400).send({auth: false, error: err});
    });
});

// @route  POST api/company/login 
// @desc   login a Company
// @access Public

companyRoutes.post('/login', (req, res) => {
    const email = req.body.email && typeof req.body.email === 'string' ? req.body.email : null; 
    const password = req.body.password && typeof req.body.password === 'string' ? req.body.password : null; 

    if(email && password){
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
    }else{
        res.status(401).json({auth: false, message: 'Invalid email or password'});
    }
});


module.exports = companyRoutes;