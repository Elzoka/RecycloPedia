const addressRoutes = require('express').Router();
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress, updatedAddressField} = require('../../../lib/address');
const {createErrorObject} = require('../../../lib/errors');
const Company = require('../../../models/Company');

// @route  POST api/company/address 
// @desc   add new address
// @access Private

addressRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // @TODO limit the max size of addresses array to 10
    const address = createAddress(req.body);
    Company
        .updateOne(
            {_id: req.companyId},
            {$addToSet: { address }},
            {runValidators: true}
        )
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
        });
});

// @route  PUT api/company/address 
// @desc   update existing address
// @access Private

addressRoutes.put('/:id', isAuthenticatedCompany,(req, res) => {
    let response;
    const addressFields = updatedAddressField(req.body);
    const toUpdateKeys = Object.keys(addressFields);

    // create query 
    const setQuery = {};
    toUpdateKeys.forEach(key => {
        setQuery[`address.$.${key}`] = addressFields[key];
    });
    Company.updateOne(
            {_id: req.companyId, "address._id": req.params.id},
            {$set: setQuery},
        )
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
        });
});

// @route  DELETE api/company/address 
// @desc   delete existing address
// @access Private

addressRoutes.delete("/:id", isAuthenticatedCompany, (req, res) => {
    let response;
    Company
        .updateOne({_id: req.companyId}, {$pull: {address: {_id: req.params.id}}})
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
        });
});

module.exports = addressRoutes;