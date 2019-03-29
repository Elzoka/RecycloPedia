const requestRoutes = require('express').Router();

const Request = require('../../../models/Request');
const Company = require('../../../models/Company');
const Client = require('../../../models/Client');
const isAuthenticatedRep = require('../../../middlwares/isAuthenticatedRep');
const {createErrorObject} = require('../../../lib/errors');


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
    }
    if(req.query.status && ['assigned', 'fullfilled'].includes(req.query.status)){
        query.status = req.query.status;
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
            // response = {
            //     message: 'internal server error'
            // };

            // res.status(500).sendError(error, response);      
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
            
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
        })
        .populate({
            path: 'items.id',
            select: 'createdAt name points images' // @TODO replace images with item logo or main image
        })
        .then(request => {
            response = {
                request
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            // if(error.name === 'CastError'){
            //     response = {message: 'Invalid Request Id'};
            
            //     return res.status(400).sendJson(response);
            // }
            
            // response = {
            //     message: 'internal server error'
            // };

            // res.status(500).sendError(error, response);
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
                
        });
});



// @route  PUT api/rep/request/:id
// @desc   update request
// @access Private (rep)
requestRoutes.put('/:id', isAuthenticatedRep, (req, res) => {
    let response;

    // @TODO when fullfilled add request points to client and subtract them from the company 
    Request.
        findOne({
            _id: req.params.id,
            representative: req.repId,
            status: 'assigned'
        },{
            representative: 1,
            company: 1,
            points: 1,
            client: 1
        }).then(dbRequest => {

            if(!dbRequest){
                response = {message: 'Invalid request id'};
    
                return res.status(400).sendJson(response);
            }

            let session = null;

            Request.db.startSession()
            .then(_session => {
                session = _session;
                session.startTransaction();
    
                return Request.updateOne(
                    {
                        _id: dbRequest._id,
                        representative: dbRequest.representative
                    },
                    {$set: {status: "fullfilled"}, $currentDate: {fullfilledAt: true}},
                    {runValidators: true, session}
                )
            }) // @TODO check if the company has enough point to  maske the transaction
            .then(() => Company.updateOne({_id: dbRequest.company}, {$inc: {points: -1 * dbRequest.points}}, {session}))
            .then(() => Client.updateOne({ _id: dbRequest.client }, {$inc: {points: dbRequest.points}},{session}))
            .then(() => session.commitTransaction())
            .then((doc) => {
                // @TODO add 404 status code for result.n = 0;
                response = {ok: doc.ok};

                res.status(200).sendJson({response});
            })
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
            
            // if(error.name === 'ValidationError' || error.name === "CastError"){
            //     response = {message: "invalid request"};
    
            //     return res.status(400).sendJson(response)
            // }
    
            // response = {message: "Internal Server Error"};
    
            // res.status(500).sendError(error, response);
        })
});



module.exports = requestRoutes;