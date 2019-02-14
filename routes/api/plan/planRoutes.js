const planRoutes = require('express').Router();

const Plan = require('../../../models/Plan');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createPlanObject} = require('../../../lib/plan');


// @route  POST api/plan 
// @desc   Create new Plan 
// @access Private (company)

planRoutes.post('/', isAuthenticatedCompany,(req, res) => {
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
    let response;

    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;
    
    // @TODO maybe check for category validation

    // validate the company
    Plan
        .find({category: req.body.category})
        .populate({
            path: 'company',
            select: 'name logo'
        })
        .sort({points: -1})
        .skip((page - 1) * limit)
        .limit(limit)
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

// @route  GET api/plan/:id 
// @desc   get Plans 
// @access Public

planRoutes.get('/:id', (req, res) => {
    let response;

    // validate the company
    Plan
        .findOne({
            _id: req.params.id
        })
        .populate({
            path: 'company',
            select: 'name logo rating'
        })
        .then(plan => {
            response = {
                plan
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            if(error.name === 'CastError'){
                response = {message: 'Invalid Plan Id'};
            
                return res.status(400).sendJson(response);
            }
            
            response = {
                message: 'internal server error'
            };

            res.status(500).sendError(error, response);            
        });
});



module.exports = planRoutes;