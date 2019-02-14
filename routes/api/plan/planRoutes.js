const planRoutes = require('express').Router();

const Plan = require('../../../models/Plan');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createPlanObject} = require('../../../lib/plan');


// @route  POST api/plan 
// @desc   Create new Plan 
// @access Private (company)

planRoutes.post('/', isAuthenticatedCompany,(req, res) => {
    // let statusCode;
    let response;
    const planObject = createPlanObject(req.body, req.companyId);

    // validate the company
    Plan
        .create(planObject)
        .then(plan => {
            // @TODO send a success message instead of the saved plan
            response = {
                plan
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            response = {
                message: 'invalid data'
            };

            res.status(400).sendJson(response);            
        });
});

module.exports = planRoutes;