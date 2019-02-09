const contactInfoRoutes = require('express').Router();
const log = require('../../../lib/log');

const Company = require('../../../models/Company');
const {createContactInfo} = require('../../../lib/company');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');

// @route  POST api/company/contact-info 
// @desc   add new contactInfo
// @access Private

contactInfoRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let statusCode;
    let response;
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    // check if there's data to update
    if(updatesKeys.length === 0){
        statusCode = 400;
        response = {message: 'no or invalid data was sent'};
        
        log.response(statusCode, response);

        return res.status(statusCode).json(response);
    }
    
    // @TODO limit the max size of each field array to 3

    // modify the request to db
    const updatesObj = {}
    updatesKeys.forEach(key => updatesObj[`contactInfo.${key}`] = updates[key]);

    // push to the contact info without repeating
    Company
        .updateOne({_id: req.companyId},{$addToSet:  updatesObj})
        .then(result => {
            statusCode = 200;
            response = {
                result
            }

            log.response(statusCode, response);
            res.status(statusCode).json(response);
        })
        .catch(error => {
            statusCode = 500;
            response = {message: 'internal server error'};
            log.err(statusCode, {error, response});
            res.status(statusCode).json(response)
        });
});


// @route  PUT api/company/contact-info 
// @desc   update existing contactInfo
// @access Private

contactInfoRoutes.put('/:fieldValue', isAuthenticatedCompany, (req, res) => {
    let statusCode;
    let response;
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){
        statusCode = 400;
        response = {message: 'no or invalid data was sent'};
        log.response(statusCode, response);

        return res.status(400).json(response)
    }
    // check that only one field is provided
    if(updatesKeys.length !== 1){
        statusCode = 400;
        response = {message: 'only one field can be provided'};
        log.response(statusCode, response);

        return res.status(statusCode).json(response);
    }

    const deletedFieldKey = updatesKeys[0];
    const deletedFieldValue = req.params.fieldValue;
    const newValue = updates[deletedFieldKey];

    // update the value
    Company
        .updateOne(
            {_id: req.companyId, [`contactInfo.${deletedFieldKey}`]: deletedFieldValue},
            {[`contactInfo.${deletedFieldKey}.$`]: newValue}
            )
        .then(result => {
            statusCode = 200;
            response = {
                result
            }

            log.response(statusCode, response);
    
            res.status(statusCode).json(response);
        })
        .catch(error => {
            statusCode = 500;
            response = {message: 'internal server error'};
            log.err(statusCode, {error, response});
    
            res.status(statusCode).json(response);
        })
});

// @route  DELETE api/company/contact-info 
// @desc   delete existing contactInfo
// @access Private

contactInfoRoutes.delete('/', isAuthenticatedCompany, (req, res) => {
    let statusCode;
    let response;

    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){
        statusCode = 400;
        response = {message: 'no or invalid data was sent'};

        log.response(statusCode, response);
        return res.status(statusCode).json(response);
    }

    // check that only one field is provided
    if(updatesKeys.length !== 1){
        statusCode = 400;
        response = {message: 'only one field can be provided'};

        log.response(statusCode, response);
        return res.status(statusCode).json(response);
    }

    // @TODO check if there's more than one value in the field array
    
    const updatedfield = updates[updatesKeys[0]];

    Company.updateOne({_id: req.companyId}, {$pull: {[`contactInfo.${updatesKeys[0]}`]: updatedfield}})
        .then(result => {
            statusCode = 200;
            response = {
                result
            }

            log.response(statusCode, response);
            res.status(200).json(response);             
        })
        .catch(error => {
            statusCode = 500;
            response = {message: 'internal server error'};

            log.err(statusCode, {error, response});
            res.status(500).json(response);
        });
});

module.exports = contactInfoRoutes;