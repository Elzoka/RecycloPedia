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


module.exports = requestRoutes;