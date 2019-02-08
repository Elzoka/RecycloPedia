const addressRoutes = require('express').Router();
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress, updatedAddressField} = require('../../../lib/company');
const Company = require('../../../models/Company');

// @route  POST api/company/address 
// @desc   add new address
// @access Private

addressRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    // @TODO limit the max size of addresses array to 10

    const address = createAddress(req.body);
    Company
        .updateOne(
            {_id: req.companyId},
            {$addToSet: { address }},
            {runValidators: true}
        )
        .then(result => {
            res.status(200).send({result});
        })
        .catch(err => {
            console.log(err);
            if(err.name === 'ValidationError' || err.name === "CastError"){
                return res.status(400).send({message: "invalid request"})
            }
            res.status(500).send({message: "internal server error"})
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
            res.status(200).json({result});
        })
        .catch(err => {
            console.log(err);
            if(err.name === 'ValidationError' || err.name === "CastError"){
                return res.status(400).send({message: "invalid request"})
            }
            res.status(500).send({message: "internal server error"})
        });
});

// @route  DELETE api/company/address 
// @desc   delete existing address
// @access Private

addressRoutes.delete("/:id", isAuthenticatedCompany, (req, res) => {
    Company
        .updateOne({_id: req.companyId}, {$pull: {address: {_id: req.params.id}}})
        .then(result => {
            res.status(200).json({result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: "internal server error"})
        });
});

module.exports = addressRoutes;