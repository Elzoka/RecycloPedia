const log = require('../lib/log');

module.exports = (req, res, next) => {

    res.sendJson = (response) => {
        let loggedResponse = {
            ...response
        }
        if(response && response.token){
            loggedResponse.token = !!response.token;
        }
        const status = res.statusCode;

        // if status code is 500 error is already logged
        if(status !== 500){
            log.response(res.statusCode, loggedResponse);
        }

        res.status(status).json(response);
    }

    // res.sendError = (error, response) => {
    //     log.err(res.statusCode, {
    //         response,
    //         error
    //     })

    //     res.status(res.statusCode).json(response);
    // }

    next();
}
