const addressRoutes = require('express').Router();
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress, updatedAddressField} = require('../../../lib/company');
const Company = require('../../../models/Company');
const log = require('../../../lib/log');

// @route  POST api/company/address 
// @desc   add new address
// @access Private

addressRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let statusCode;
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
            statusCode = 200;
            response = {result};

            log.response(statusCode, response);
            res.status(statusCode).json(response);
        })
        .catch(error => {
            if(err.name === 'ValidationError' || err.name === "CastError"){
                statusCode = 400;
                response = {message: "invalid request"};

                log.response(statusCode, response);
                return res.status(statusCode).json(response);
            }
            statusCode = 500;
            response = {message: "internal server error"};

            log.err(statusCode, {
                response,
                error
            })
            res.status(statusCode).json(response);
        });
});

// @route  PUT api/company/address 
// @desc   update existing address
// @access Private

addressRoutes.put('/:id', isAuthenticatedCompany,(req, res) => {
    const addressFields = updatedAddressField(req.body);
    Company.updateOne(
            {_id: req.companyId, "address._id": req.params.id},
            {$set: {"address.$": addressFields}}, // @TODO stop auto updating id
        )
        .then(result => {
            statusCode = 200;
            response = {result};

            log.response(statusCode, response);
            res.status(statusCode).json(response);
        })
        .catch(error => {
            console.log(err);
            if(err.name === 'ValidationError' || err.name === "CastError"){
                statusCode = 400;
                response = {message: "invalid request"};

                log.response(statusCode, response);
                return res.status(statusCode).json(response)
            }

            statusCode = 500;
            response = {message: "internal server error"};

            log.err(statusCode, {
                response,
                error
            })
            res.status(statusCode).json(response);
        });
});

// @route  DELETE api/company/address 
// @desc   delete existing address
// @access Private

addressRoutes.delete("/:id", isAuthenticatedCompany, (req, res) => {
    Company
        .updateOne({_id: req.companyId}, {$pull: {address: {_id: req.params.id}}})
        .then(result => {
            statusCode = 200;
            response = {result};

            log.response(statusCode, response);
            res.status(statusCode).json(response);
        })
        .catch(error => {
            statusCode = 500;
            response = {message: "internal server error"};

            log.err(statusCode, {
                response,
                error
            })
            res.status(statusCode).json(response);
            
        });
});

module.exports = addressRoutes;