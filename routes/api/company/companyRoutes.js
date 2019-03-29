const companyRoutes = require('express').Router();

const Company = require('../../../models/Company');
const {createCompanyObject, updatedCompanyFields} = require('../../../lib/company');
const {createErrorObject} = require('../../../lib/errors');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');

// @@@@@ TODO ===>  ADD SUITABLE ERROR MESSAGES

// @route  POST api/company 
// @desc   Create new Company 
// @access Public

companyRoutes.post('/', (req, res) => {
    let response;
    const companyObj = createCompanyObject(req.body);

    // validate the company
    Company
        .create(companyObj)
        .then(savedCompany => {
            // return token to user
            savedCompany.generateAuthToken()
                .then(token => {
                    response = {auth: true, token};

                    res.status(200).sendJson(response);
                })
        })
        .catch(error => {
            // res.status(400).sendJson(response);
            const errorObject = createErrorObject(error, true);
            res.status(errorObject.status).sendJson(errorObject.response);
            
        });
});


// @route  GET api/company 
// @desc   get companies
// @access Public

companyRoutes.get('/', (req, res) => {
    let response;
    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;

    // @TODO sort by location - name - createdAt - etc
    Company
    .find({}, {name: 1, rating: 1, logo: 1, serviceAvailableIn: 1})
    .sort({rating: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(companies => {
        response = {
            companies
        };

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
    })
});

// @route  GET api/company/:id 
// @desc   get company by id
// @access Public

companyRoutes.get('/:id', (req, res) => {
    let response;
    const companyId = req.params.id;

    Company
    .findOne(
        {_id: companyId},
        {
            requests: 0,
            email: 0,
            password: 0,
        }
    )
    .then(company => {
        if(!company){
            response = {message: 'Company not found'};

            return res.status(404).sendJson(response);
        }
        response = {company};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
    })
});


// @route  PUT api/company 
// @desc   update company
// @access Private (company)
companyRoutes.put('/', isAuthenticatedCompany, (req, res) => {
    let response;
    
    const updatedCompanyObject = updatedCompanyFields(req.body);
    
    Company.updateOne(
        {_id: req.companyId},
        {$set: updatedCompanyObject},
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
        response = {result};

        res.status(200).sendJson(response)
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
            
    });
});

module.exports = companyRoutes;