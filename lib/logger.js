'use strict';

const winston = require('winston');
const logger = new winston.Logger;

logger.add(winston.transports.File, {
  json: false,
  timestamp: true,
  filename: 'application.log'
});

if (process.env.NODE_ENV === 'dev') {
  logger.add(winston.transports.Console, {
    json: false,
    colorize: true,
    timestamp: true
  });
}

module.exports = logger;
