const repRoutes = require('express').Router();

const Representative = require('../../../models/Representative');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const { createRepObject, updatedRepFields } = require('../../../lib/rep');
const { createErrorObject } = require('../../../lib/errors');

// @route  POST api/rep 
// @desc   create a new rep
// @access Private (company)

repRoutes.post('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // validate request data
    const repObj = createRepObject(req.body, req.companyId);
    Representative
        .create(repObj)
        .then(newRep => {
            newRep
                .generateAuthToken()
                .then(token => {
                    response = {auth: true, token};
                    res.status(200).sendJson(response);
                })
        })
        .catch(error => {
            const errorObject = createErrorObject(error, true);
            res.status(errorObject.status).sendJson(errorObject.response);
        });
});

// @route  GET api/rep 
// @desc   get representatives
// @access Private (company)

repRoutes.get('/', isAuthenticatedCompany, (req, res) => {
    let response;
    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;

    Representative
    .find({company: req.companyId}, {username: 1, pic: 1, name: 1})
    .sort({username: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .then(representatives => {
        response = {
            representatives
        };

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
            
    });
});

// @route  GET api/rep/:id 
// @desc   get rep by id
// @access Public 

// @TODO check if maybe make access private
repRoutes.get('/:id', (req, res) => {
    let response;
    const repId = req.params.id;

    Representative
    .findOne(
        {_id: repId},
        {
            requests: 0,
            password: 0,
        }
    )
    .populate({
        path: 'company',
        select: 'name logo'
    })
    .then(rep => {
        if(!rep){
            response = {message: 'Representative not found'};

            return res.status(404).sendJson(response);
        }
        response = {rep};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
    })
});


// @route  PUT api/rep/:id 
// @desc   update rep
// @access Private (company)

repRoutes.put('/:id', isAuthenticatedCompany, (req, res) => {
    let response;
    
    const updatedCompanyObject = updatedRepFields(req.body);
    
    Representative.updateOne(
        {
            _id: req.params.id,
            company:req.companyId
        },
        {$set: updatedCompanyObject},
        {runValidators: true}
    )
    .then(result => {
        // @TODO add 404 status code for result.n = 0;
        response = {result};

        res.status(200).sendJson(response);
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
            
    })
});

// @route  DELETE api/rep/:id
// @desc   delete rep
// @access Private (company)
repRoutes.delete('/:id', isAuthenticatedCompany, (req, res) => {
    Representative.deleteOne(
        {
            _id: req.params.id,
            company: req.companyId
        },
    )
    .then(result => {
        response = {result};

        res.status(200).sendJson(response)
    })
    .catch(error => {
        const errorObject = createErrorObject(error);
        res.status(errorObject.status).sendJson(errorObject.response);
            
    });
});


module.exports = repRoutes;