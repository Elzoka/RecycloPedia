const contactInfoRoutes = require('express').Router();

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

    // modify the request to db
    const updatesObj = {}
    updatesKeys.forEach(key => updatesObj[`contactInfo.${key}`] = updates[key]);

    // push to the contact info without repeating
    Company
        .updateOne({_id: req.companyId},{$addToSet:  updatesObj})
        .then(result => {
            res.status(200).json({result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'internal server error'})
        });
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

    const updatedfield = updates[updatesKeys[0]];

    Company.updateOne({_id: req.companyId}, {$pull: {[`contactInfo.${updatesKeys[0]}`]: updatedfield}})
        .then(result => {
            res.send(result); 
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = contactInfoRoutes;