const contactInfoRoutes = require('express').Router();
const log = require('../../../lib/log');

const Company = require('../../../models/Company');
const {createContactInfo} = require('../../../lib/company');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');

// @route  POST api/company/contact-info 
// @desc   add new contactInfo
// @access Private

contactInfoRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    // check if there's data to update
    if(updatesKeys.length === 0){
        return res.status(400).json({message: 'no or invalid data was sent'})
    }
    
    // @TODO limit the max size of each field array to 3

    // modify the request to db
    const updatesObj = {}
    updatesKeys.forEach(key => updatesObj[`contactInfo.${key}`] = updates[key]);

    // push to the contact info without repeating
    Company
        .updateOne({_id: req.companyId},{$addToSet:  updatesObj})
        .then(result => {
            log.response(200, result);
            res.status(200).json({result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'internal server error'})
        });
});


// @route  PUT api/company/contact-info 
// @desc   update existing contactInfo
// @access Private

contactInfoRoutes.put('/:fieldValue', isAuthenticatedCompany, (req, res) => {
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){
        return res.status(400).json({message: 'no or invalid data was sent'})
    }
    // check that only one field is provided
    if(updatesKeys.length !== 1){
        return res.status(400).json({message: 'only one field can be provided'})
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
            res.status(200).json({result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'internal server error'})
        })
});

// @route  DELETE api/company/contact-info 
// @desc   delete existing contactInfo
// @access Private

contactInfoRoutes.delete('/', isAuthenticatedCompany, (req, res) => {
    // validate data
    const updates = createContactInfo(req.body);
    const updatesKeys = Object.keys(updates);
    
    // check if there's data to update
    if(updatesKeys.length === 0){
        return res.status(400).json({message: 'no or invalid data was sent'})
    }

    // check that only one field is provided
    if(updatesKeys.length !== 1){
        return res.status(400).json({message: 'only one field can be provided'})
    }

    // @TODO check if there's more than one value in the field array
    
    const updatedfield = updates[updatesKeys[0]];

    Company.updateOne({_id: req.companyId}, {$pull: {[`contactInfo.${updatesKeys[0]}`]: updatedfield}})
        .then(result => {
            res.status(200).json({result});             
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'internal server error'})
        });
});

module.exports = contactInfoRoutes;