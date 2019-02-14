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

// @route  GET api/plan 
// @desc   get Plans 
// @access Public

planRoutes.get('/', (req, res) => {
    // let statusCode;
    let response;
    // @TODO maybe check for category validation

    // validate the company
    Plan
        .find({category: req.body.category})
        .populate({
            path: 'company',
            select: 'name logo'
        })
        .then(plans => {
            response = {
                plans
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            response = {
                message: 'internal server error'
            };

            res.status(500).sendError(error, response);            
        });
});



module.exports = planRoutes;