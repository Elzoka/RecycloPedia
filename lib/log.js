const winston = require('winston');
const path = require('path');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
const util = require('util');
const debugServer = util.debuglog('server');

const myFormat = printf(({ level, message, timestamp }) => {
	const {type, method, status,path, ip, body, query, response, err, params} = message; // data
	let output = `${timestamp}: [${level}] - [${type}] `;

	switch(type){
		case 'request':
			return output += ` (ip) ${ip} (method) ${method} (path) ${path} (body) ${JSON.stringify(body)} (query) ${JSON.stringify(query)} (params) ${JSON.stringify(params)}`;
		case 'response':
			return output += `(status) ${status} (response) ${JSON.stringify(response)}`;
		case 'error':
            return output += `(status) ${status} (response) ${JSON.stringify(err)}`;
	}

    return output;
});

const logFile = path.join(__dirname, '../.log/mylog.log')
const logger = createLogger({
    levels: {
      error: 0,
      warning: 1, // maybe i'll need it later
      info: 2
    },
    format: combine(
        timestamp(),
        myFormat,
    ),
    transports: [
        new transports.File({filename: logFile, level: 'info'})
    ]
});

_lib = {};

_lib.request = (data) => {
	debugServer(JSON.stringify(data));
	data.type = 'request';
	logger.log({level: 'info', message: data});
}

_lib.response = (status, response) => {
	const data = Object.assign({}, {status}, {response});

	debugServer(JSON.stringify(data));
	data.type = 'response';
	logger.log({level: 'info', message: data});
}

_lib.err = (status, err) => {
    const data = Object.assign({}, {status}, {err});
	debugServer(JSON.stringify(data));
	data.type = 'server error';
	logger.log({level: 'error', message: data});
}

// @TODO compress log files

module.exports = _lib;