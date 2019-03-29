const log = require('./log');

_lib = {};

_lib.createErrorObject = (error, isAuth = false, message = null) => {
    let errorObject = null; 
    // console.log(JSON.stringify(error, null, 2));

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

////////////////////////////////////////// EX1 ///////////////////////////////////////////////
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
////////////////////////////////////////// EX2 ///////////////////////////////////////////////

// {
//     "errors": {
//       "address": {
//         "errors": {
//           "coordinates.latitude": {
//             "message": "langitude field is required",
//             "name": "ValidatorError",
//             "properties": {
//               "message": "langitude field is required",
//               "type": "required",
//               "path": "coordinates.latitude",
//               "value": null
//             },
//             "kind": "required",
//             "path": "coordinates.latitude",
//             "value": null
//           },
//           "coordinates.longitude": {
//             "message": "longitude field is required",
//             "name": "ValidatorError",
//             "properties": {
//               "message": "longitude field is required",
//               "type": "required",
//               "path": "coordinates.longitude",
//               "value": null
//             },
//             "kind": "required",
//             "path": "coordinates.longitude",
//             "value": null
//           }
//         },
//         "_message": "Validation failed",
//         "message": "Validation failed: coordinates.latitude: langitude field is required, coordinates.longitude: longitude field is required",
//         "name": "ValidationError",
//         "path": "address"
//       }
//     },
//     "_message": "Validation failed",
//     "message": "Validation failed: address: Validation failed: coordinates.latitude: langitude field is required, coordinates.longitude: longitude field is required",
//     "name": "ValidationError"
//   }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function _createErrorMessages(errorObj){
    let errors = {};    
    
    for(key in errorObj){
        if(errorObj.hasOwnProperty(key)){
            if(errorObj[key].errors){
                errors = _createErrorMessages(errorObj[key].errors);
            }else{
                let message;
                switch(errorObj[key].kind){
                    case 'required':
                        message = `${key} field is required.`;
                        break;
                    case 'maxlength':
                        message = `${key} field lenght is too long.`;
                        break;
                    default:
                        message = errorObj[key].message;
                        break;
                }
                errors[key] = message;
            }
        }
    }
    
    return errors
}

function _handleValidationError({errors}) {
    return {
        status: 400,
        response: {
            errors: _createErrorMessages(errors)
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
        errors[error.path] = 'invalid object id';
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