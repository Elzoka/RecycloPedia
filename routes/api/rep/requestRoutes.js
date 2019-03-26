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

// @route  GET api/rep/request/:id 
// @desc   get request by id
// @access private (rep)

requestRoutes.get('/:id', isAuthenticatedRep,(req, res) => {
    let response;

    Request
        .findOne({
            representative: req.repId,
            _id: req.params.id
        })
        .select('-company -representative')
        .populate({
            path: 'client',
            select: 'name pic rating'
        }) // @TODO populate items
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