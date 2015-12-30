'use strict';

const logger = require('winston');

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.isBoom ? err.output.statusCode : 500;
  const message = err.message;
  const level = statusCode >= 500 ? 'error' : 'warn';

  logger.log(level, message, { statusCode: statusCode });
  res.status(statusCode).send({
    errors: [
      { status: statusCode.toString(), detail: message }
    ]
  });
};
