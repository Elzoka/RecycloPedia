const winston = require('winston');
const path = require('path');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;
const util = require('util');
const debugServer = util.debuglog('server');

const myFormat = printf(({ level, message, timestamp }) => {
	let output = `${timestamp}: ${level} - `;

	if(level.includes('info')){
		if(message.method && message.path){
			output += `[request] (ip) ${message.ip} (method) ${message.method} (path) ${message.path} (data) ${JSON.stringify(message.body)}`;
		}else{
			output += `[response] (status) ${message.status} (data) ${JSON.stringify(message.response)}`;
		}
	}else{		
		output += `(status) ${message.status} (data) ${JSON.stringify(message.err)}`;
	}

    return output;
});

const myCustomLevels = {
    levels: {
      error: 0,
      warning: 1, // maybe i'll need it later
      info: 2
    },
    colors: {
      error: 'red',
      warning: 'yellow',
      info: 'green'
    }
  };
  
const logFile = path.join(__dirname, '../.log/mylog.log')
const logger = createLogger({
    levels: myCustomLevels.levels,
    format: combine(
        colorize(),
        timestamp(),
        myFormat,
    ),
    transports: [
        new transports.File({filename: logFile, level: 'info'})
    ]
});

winston.addColors(myCustomLevels.colors);

_lib = {};

_lib.request = (data) => {
	debugServer(data);
	logger.log({level: 'info', message: data});
}

_lib.response = (status, response) => {
	const data = Object.assign({}, {response}, {status});

	debugServer(data);
	logger.log({level: 'info', message: data});
}

_lib.err = (status, err) => {
	debugServer(data);
	const data = Object.assign({}, {err}, {status});
	logger.log({level: 'error', message: data});
}

module.exports = _lib;