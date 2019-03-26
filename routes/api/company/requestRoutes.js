const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');


// @route  GET api/company/request
// @desc   get company requests
// @access private (company)

requestRoutes.get('/', isAuthenticatedCompany, (req, res) => {
    let response;

    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;
    
    // @TODO add various sorting and filters
    Request
        .find({
            company: req.companyId
        })
        .select('client representative points createdAt status')
        .populate({
            path: 'client',
            select: 'name pic'
        })
        .populate({
            path: 'representative',
            select: 'name pic'
        })
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .then(requests => {
            response = {
                requests
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


// @route  GET api/company/request/:id 
// @desc   get request by id
// @access private (company)

requestRoutes.get('/:id', isAuthenticatedCompany,(req, res) => {
    let response;

    Request
        .findOne({
            company: req.companyId,
            _id: req.params.id
        })
        .select('-company')
        .populate({
            path: 'client',
            select: 'name pic rating'
        })
        .populate({
            path: 'representative',
            select: 'name pic'
        })
        .then(request => {
            response = {
                request
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


module.exports = requestRoutes;