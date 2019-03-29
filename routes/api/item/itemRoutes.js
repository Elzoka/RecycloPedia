const itemRoutes = require('express').Router();

const Item = require('../../../models/Item');
const isAuthenticatedCompany = require('../../../middlwares/isAuthenticatedCompany');
const {createItemObject, updatedItemFields} = require('../../../lib/item');
const {createErrorObject} = require('../../../lib/errors');



// @route  POST api/item 
// @desc   Create new item 
// @access Private (company)

itemRoutes.post('/', isAuthenticatedCompany,(req, res) => {
    let response;
    const itemObject = createItemObject(req.body, req.companyId);

    // validate the company
    Item
        .create(itemObject)
        .then(item => {
            // @TODO send a success message instead of the saved item
            response = {
                item
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);        
        });
});

// @route  GET api/item 
// @desc   get items 
// @access Public

itemRoutes.get('/', (req, res) => {
    let response;

    // pagination
    const page = req.query.page || 1;
    const limit =  req.query.limit && req.query.limit <= 20 ? req.query.limit : 10;
    
    // @TODO maybe check for category validation

    // validate the company
    Item
        .find({category: req.body.category})
        .populate({
            path: 'company',
            select: 'name logo'
        })
        .sort({points: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .then(items => {
            response = {
                items
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
        });
});

// @route  GET api/item/:id 
// @desc   get items 
// @access Public

itemRoutes.get('/:id', (req, res) => {
    let response;

    // validate the company
    Item
        .findOne({
            _id: req.params.id
        })
        .populate({
            path: 'company',
            select: 'name logo rating'
        })
        .then(item => {
            response = {
                item
            }

            res.status(200).sendJson(response);
        })
        .catch(error => {    
            const errorObject = createErrorObject(error);
            res.status(errorObject.status).sendJson(errorObject.response);
            
        });
});



// @route  PUT api/item/:id
// @desc   update item
// @access Private (company)
itemRoutes.put('/:id', isAuthenticatedCompany, (req, res) => {
    let response;
    
    const {pushImages, pullImage, ...itemObject} = updatedItemFields(req.body);

    const updateQuery = {};
    if(pushImages && pushImages.length > 0){
        updateQuery['$addToSet'] = {images: pushImages};
    }else if(pullImage){
        updateQuery['$pull'] = {images: pullImage};
    }

    if(Object.keys(itemObject).length > 0){
        updateQuery['$set'] = itemObject;
    }

    if(Object.keys(updateQuery).length < 1){

        response = {message: "invalid request"};
        return res.status(400).sendJson(response)
    }

    Item.updateOne(
        {
            _id: req.params.id,
            company: req.companyId
        },
        updateQuery,
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

// @route  DELETE api/item/:id
// @desc   delete item
// @access Private (company)
itemRoutes.delete('/:id', isAuthenticatedCompany, (req, res) => {

    Item.deleteOne(
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

module.exports = itemRoutes;