const companyRoutes = require('express').Router();

const Company = require('../../../models/Company');
const {createCompanyObject, updatedCompanyFields} = require('../../../lib/company');
const isLoggedIn = require('../../../middlwares/isLoggedIn');

// @@@@@ TODO ===>  ADD SUITABLE ERROR MESSAGES

// @route  POST api/company 
// @desc   Create new Company 
// @access Public

companyRoutes.post('/', (req, res) => {
    const companyObj = createCompanyObject(req.body);
    const company = new Company(companyObj);

    // validate the company
    company
    .validate()
    .then(() => {
        // if valid save it
        company
        .save()
        .then(savedCompany => {
            // return token to user
            savedCompany.generateAuthToken()
                .then(token => {
                    res.status(200).send({auth: true, token});
                })
                .catch(e => {
                    res.status(500).send({auth: false, error: e});
                });
        })
        .catch(e => {
            res.status(500).send({auth: false, error: e});
        });
    })
    .catch(err => {
        res.status(400).send({auth: false, error: err});
    });
});


// @route  GET api/company 
// @desc   get companies
// @access Public

companyRoutes.get('/', (req, res) => {
    // pagination
    const page = req.params.page || 1;
    const limit =  req.params.limit && req.params.limit < 20 ? req.params.limit : 10;

    // @TODO sort by location - name - createdAt
    Company
    .find({}, {name: 1, rating: 1, logo: 1, serviceAvailableIn: 1})
    .sort({rating: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(companies => {
        res.status(200).json({companies});
    })
    .catch(err => {
        res.status(500).json({message: 'Internal Server error'});
    })
});

// @route  GET api/company:id 
// @desc   get company by id
// @access Public

companyRoutes.get('/:id', (req, res) => {
    const companyId = req.params.id;

    Company
    .findOne(
        {_id: companyId},
        {representatives: 0,
            requests: 0,
            email: 0,
            password: 0,
        }
    )
    .then(company => {
        if(!company){
            return res.status(404).json({message: 'Company not found'});
        }
        res.status(200).json({company});
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({message: 'Invalid Company Id'});
    })
});


// @route  PUT api/company:id 
// @desc   update company by id
// @access Private (company)
companyRoutes.put('/:id', isLoggedIn, (req, res) => {
    if(req.params.id !== req.companyId){
        return res.status(401).json({message: 'unauthorized'});
    }
    const updatedCompanyObject = updatedCompanyFields(req.body);
    
    Company.updateOne(
        {_id: req.companyId},
        {$set: updatedCompanyObject}
    )
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).send({message: "Internal Server Error"});
    })
});


// @route  DELETE api/company
// @desc   delete company
// @access Private (company)
companyRoutes.delete('/', isLoggedIn, (req, res) => {

    Company.deleteOne(
        {_id: req.companyId},
    )
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).send({message: "Internal Server Error"});
    })
});

module.exports = companyRoutes;