const companyRoutes = require('express').Router();

const Company = require('../../../models/Company');
const {createCompanyObject, updatedCompanyFields} = require('../../../lib/company');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const log = require('../../../lib/log');

// @@@@@ TODO ===>  ADD SUITABLE ERROR MESSAGES

// @route  POST api/company 
// @desc   Create new Company 
// @access Public

companyRoutes.post('/', (req, res) => {
    let statusCode;
    let response;
    const companyObj = createCompanyObject(req.body);

    // validate the company
    Company
        .create(companyObj)
        .then(savedCompany => {
            // return token to user
            savedCompany.generateAuthToken()
                .then(token => {
                    statusCode = 200;
                    response = {auth: true, token};

                    log.response(statusCode, {
                        ...response,
                        token: !!token
                    })
                    res.status(response).json(response);
                })
                .catch(error => {
                    statusCode = 500;
                    response = {
                        auth: false,
                        message: 'internal server error'
                    };

                    log.err(statusCode, {
                        response,
                        error
                    });
                    res.status(statusCode).json(response);
                });
        })
        .catch(error => {
            statusCode = 400;
            response = {
                auth: false,
                message: 'invalid data'
            };

            log.response(statusCode, {
                response,
                error
            });
            res.status(statusCode).json(response);
        });
});


// @route  GET api/company 
// @desc   get companies
// @access Public

companyRoutes.get('/', (req, res) => {
    let statusCode;
    let response;
    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit < 20 ? req.query.limit : 10;

    // @TODO sort by location - name - createdAt - etc
    Company
    .find({}, {name: 1, rating: 1, logo: 1, serviceAvailableIn: 1})
    .sort({rating: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(companies => {
        statusCode = 200;
        response = {
            companies
        };

        log.response(statusCode, response);
        res.status(statusCode).json(response);
    })
    .catch(error => {
        statusCode = 500;
        response = {message: 'Internal Server error'};

        log.err(statusCode, {
            response,
            error
        });

        res.status(statusCode).json(response);
    })
});

// @route  GET api/company:id 
// @desc   get company by id
// @access Public

companyRoutes.get('/:id', (req, res) => {
    let statusCode;
    let response;
    const companyId = req.params.id;

    Company
    .findOne(
        {_id: companyId},
        {
            representatives: 0,
            requests: 0,
            email: 0,
            password: 0,
        }
    )
    .then(company => {
        if(!company){
            statusCode = 404;
            response = {message: 'Company not found'};

            log.response(statusCode, response);
            return res.status(statusCode).json(response);
        }
        statusCode = 200;
        response = {company};

        log.response(statusCode, response);
        res.status(statusCode).json(response);
    })
    .catch(error => {
        statusCode = 400;
        response = {message: 'Invalid Company Id'};

        log.response(statusCode, {
            response,
            error
        });
        res.status(status).json(response);
    })
});


// @route  PUT api/company:id 
// @desc   update company by id
// @access Private (company)
companyRoutes.put('/', isAuthenticatedCompany, (req, res) => {
    let statusCode;
    let response;
    
    const updatedCompanyObject = updatedCompanyFields(req.body);
    
    Company.updateOne(
        {_id: req.companyId},
        {$set: updatedCompanyObject},
        {runValidators: true}
    )
    .then(result => {
        // @TODO add 404 status code for result.n = 0;
        statusCode = 200;
        response = {result};

        log.response(statusCode, response);
        res.status(statusCode).json(response);
    })
    .catch(error => {
        statusCode = 500;
        response = {message: "Internal Server Error"};

        log.response(statusCode, {
            response,
            error
        });

        res.status(statusCode).json(response);
    })
});


// @route  DELETE api/company
// @desc   delete company
// @access Private (company)
companyRoutes.delete('/', isAuthenticatedCompany, (req, res) => {

    // @TODO create a transaction to remove all associated reps and requests
    Company.deleteOne(
        {_id: req.companyId},
    )
    .then(result => {
        statusCode = 200;
        response = {result};

        log.response(statusCode, response);
        res.status(statusCode).json(response)
    })
    .catch(error => {
        statusCode = 500;
        response = {message: "Internal Server Error"};

        log.response(statusCode, {
            response,
            error
        });

        res.status(statusCode).json(response);
    });
});

module.exports = companyRoutes;