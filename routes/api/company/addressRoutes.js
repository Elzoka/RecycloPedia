const addressRoutes = require('express').Router();

const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress, updatedAddressField} = require('../../../lib/company');
const Company = require('../../../models/Company');

addressRoutes.post('/', isAuthenticatedCompany, (req, res) => {
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

addressRoutes.put('/:id', isAuthenticatedCompany,(req, res) => {
    const addressFields = updatedAddressField(req.body);
    Company.updateOne(
            {_id: req.companyId, "address._id": req.params.id},
            {$set: {"address.$": addressFields}},
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

module.exports = addressRoutes;