const log = require('./log');

_lib = {};

_lib.createErrorObject = (error, isAuth = false, message = null) => {
    let errorObject = null; 

    switch(error.name){
        case 'MongoError':
        case 'CastError':
            errorObject = _handleMongoError(error);
            break;
        case 'ValidationError':
            errorObject = _handleValidationError(error);
            break;
        default:
            errorObject = _handelServerError(error);
            break;
    }

    if(errorObject && errorObject.response){
        // if response is on authentication routes then set auth property to false
        if(isAuth){
            errorObject.response.auth = false;
        }

        if(message){
            errorObject.response.message = message;
        }
    }

    return errorObject;
}


// Validation Error Example

// {
//     "errors": {
//         "phone": {
//             "message": "Path `phone` is required.",
//             "name": "ValidatorError",
//             "properties": {
//                 "message": "Path `phone` is required.",
//                 "type": "required",
//                 "path": "phone",
//                 "value": null
//             },
//             "kind": "required",
//             "path": "phone",
//             "value": null
//         }
//     },
//     "_message": "client validation failed",
//     "message": "client validation failed: phone: Path `phone` is required.",
//     "name": "ValidationError"
// }

function _handleValidationError({errors: validationErrors}) {
    const status = 400;
    const errors = {};
    

    for(key in validationErrors){
        if (validationErrors.hasOwnProperty(key)) {
            errors[key] = validationErrors[key].message;
        } 
    }
    
    return {
        status,
        response: {
            errors
        }
    }
}

// MongoDB error example

// {
//     "driver": true,
//     "name": "MongoError",
//     "index": 0,
//     "code": 11000,
//     "errmsg": "E11000 duplicate key error collection: recycle.clients index: email_1 dup key: { : \"mahmoudelzoka@yahoo.com\" }"
// }


function _handleMongoError(error){
    const status = 400;
    const errors = {};

    // @TODO add "CastError"
    // code 11000 refers to duplicate key in [email, username] index
    if(error.code === 11000){
        const key = error.errmsg.includes('recycle.representatives') ? 'username' : "email";
        errors[key] = 'duplicated key';
    }else if (error.name === 'CastError') {
        errors[error.value] = 'invalid object id';
    }else{
        return _handelServerError(error);
    }

    return {
        status,
        response: {
            errors
        }
    }

}



function _handelServerError(error){
    const status = 500;
    const response = {
        status,
        response: {
            errors: {
                internalServerError: 'Internal server error'
            }
        }
    }

    // @TODO notify the server admin

    // log Error;
    log.err(status, {
        response,
        error
    });

    return response;
}
    

module.exports = _lib;