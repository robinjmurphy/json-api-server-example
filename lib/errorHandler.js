'use strict';

const logger = require('winston');
const Boom = require('boom');

function format(err) {
  const payload = err.output.payload;

  return {
    errors: [
      {
        status: payload.statusCode.toString(),
        title: payload.error,
        detail: payload.message
      }
    ]
  };
}

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (!err.isBoom) err = Boom.wrap(err);

  const message = err.message;
  const level = err.isServer ? 'error' : 'warn';
  const statusCode = err.output.statusCode;

  logger.log(level, message, { statusCode: err.output.statusCode });
  res.status(statusCode).send(format(err));
};
