const addressRoutes = require('express').Router();

const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createAddress} = require('../../../lib/company');
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
            if(err.name === 'ValidationError'){
                return res.status(400).send({message: "invalid request"})
            }
            res.status(500).send({message: "internal server error"})
        });
});

module.exports = addressRoutes;