const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const isAuthenticatedRep = require('../../../middlwares/isAuthenticatedRep');

// @route  GET api/rep/request
// @desc   get rep requests
// @access private (rep)

requestRoutes.get('/', isAuthenticatedRep, (req, res) => {
    let response;

    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;
    
    // create query object
    const query = {
        representative: req.repId,
        status: ['assigned', 'fullfilled'].includes(req.query.status) ? req.query.status : 'assigned'
    }
    
    // @TODO add various sorting and filters
    Request
        .find(query)
        .select('client points createdAt status')
        .populate({
            path: 'client',
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