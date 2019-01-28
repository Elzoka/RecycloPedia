const companyRoutes = require('express').Router();
const Company = require('../../models/Company');
const {createCompanyObject} = require('../../lib/company');

// @@@@@ TODO ===>  ADD SUITABLE ERROR MESSAGES

// @route  POST api/company 
// @desc   Create new Company 
// @access Public

companyRoutes.post('/', (req, res) => {
    const companyObj = createCompanyObject(req.body);
    const company = new Company(companyObj);
    const agent = req.headers['user-agent'];

    // validate the company
    company
    .validate()
    .then(() => {
        // if valid save it
        company
        .save()
        .then(savedCompany => {
            // return token to user
            savedCompany.generateAuthToken(agent)
                .then(token => {
                    res.status(200).send({auth: true, token, company: savedCompany});
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


module.exports = companyRoutes;