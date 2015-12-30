'use strict';

const logger = require('winston');
const Boom = require('boom');

function format(statusCode, message) {
  return {
    errors: [
      { status: statusCode.toString(), detail: message }
    ]
  };
}

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (!err.isBoom) err = Boom.wrap(err);

  const message = err.message;
  const level = err.isServer ? 'error' : 'warn';
  const statusCode = err.output.statusCode;

  logger.log(level, message, { statusCode: statusCode });
  res.status(statusCode).send(format(statusCode, message));
};
