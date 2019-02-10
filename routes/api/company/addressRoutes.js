const addressRoutes = require('express').Router();
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress, updatedAddressField} = require('../../../lib/company');
const Company = require('../../../models/Company');

// @route  POST api/company/address 
// @desc   add new address
// @access Private

addressRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    // let statusCode;
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
            if(error.name === 'ValidationError' || error.name === "CastError"){
                response = {message: "invalid request"};

                return res.status(400).sendJson(response);
            }
            response = {message: "internal server error"};

            res.status(500).sendError(error, response);
        });
});

// @route  PUT api/company/address 
// @desc   update existing address
// @access Private

addressRoutes.put('/:id', isAuthenticatedCompany,(req, res) => {
    let response;
    const addressFields = updatedAddressField(req.body);
    Company.updateOne(
            {_id: req.companyId, "address._id": req.params.id},
            {$set: {"address.$": addressFields}}, // @TODO stop auto updating id
        )
        .then(result => {
            response = {result};

            res.status(200).sendJson(response);
        })
        .catch(error => {
            if(err.name === 'ValidationError' || err.name === "CastError"){
                response = {message: "invalid request"};

                return res.status(400).sendJson(response)
            }

            response = {message: "internal server error"};
            res.status(500).sendError(error, response);
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
            response = {message: "internal server error"};
            res.status(500).sendError(error, response);            
        });
});

module.exports = addressRoutes;