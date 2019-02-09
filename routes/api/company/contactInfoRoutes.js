const contactInfoRoutes = require('express').Router();

const Company = require('../../../models/Company');
const {createContactInfo} = require('../../../lib/company');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');

// @route  POST api/company/contact-info 
// @desc   add new contactInfo
// @access Private

contactInfoRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    // check if there's data to update
    if(updatesKeys.length === 0){
        response = {message: 'no or invalid data was sent'};

        return res.status(400).sendJson(response);
    }
    
    // @TODO limit the max size of each field array to 3

    // modify the request to db
    const updatesObj = {}
    updatesKeys.forEach(key => updatesObj[`contactInfo.${key}`] = updates[key]);

    // push to the contact info without repeating
    Company
        .updateOne({_id: req.companyId},{$addToSet:  updatesObj})
        .then(result => {
            response = {result};
            res.status(200).sendJson(response);
        })
        .catch(error => {
            response = {message: 'internal server error'};
            res.status(500).sendError(error, response); 
        });
});


// @route  PUT api/company/contact-info 
// @desc   update existing contactInfo
// @access Private

contactInfoRoutes.put('/:fieldValue', isAuthenticatedCompany, (req, res) => {
    let response;
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){

        response = {message: 'no or invalid data was sent'};
        return res.status(400).sendJson(response)
    }
    // check that only one field is provided
    if(updatesKeys.length !== 1){
        response = {message: 'only one field can be provided'};

        return res.status(400).sendJson(response);
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
            response = {
                result
            }
    
            res.status(200).sendJson(response);
        })
        .catch(error => {
            response = {message: 'internal server error'};
    
            res.status(500).sendError(error, response);
        })
});

// @route  DELETE api/company/contact-info 
// @desc   delete existing contactInfo
// @access Private

contactInfoRoutes.delete('/', isAuthenticatedCompany, (req, res) => {
    let response;

    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){
        response = {message: 'no or invalid data was sent'};

        return res.status(400).sendJson(response);
    }

    // check that only one field is provided
    if(updatesKeys.length !== 1){
        response = {message: 'only one field can be provided'};

        return res.status(400).sendJson(response);
    }

    // @TODO check if there's more than one value in the field array
    
    const updatedfield = updates[updatesKeys[0]];

    Company.updateOne({_id: req.companyId}, {$pull: {[`contactInfo.${updatesKeys[0]}`]: updatedfield}})
        .then(result => {
            response = {
                result
            }

            res.status(200).sendJson(response);             
        })
        .catch(error => {
            response = {message: 'internal server error'};

            res.status(500).sendError(error, response);
        });
});

module.exports = contactInfoRoutes;