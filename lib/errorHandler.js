'use strict';

const Boom = require('boom');
const convert = require('boom-to-json-api');
const logger = require('./logger');

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (!err.isBoom) err = Boom.wrap(err);

  const statusCode = err.output.statusCode;
  const level = err.isServer ? 'error' : 'warn';

  logger.log(level, err.message, { statusCode });

  res.status(statusCode).send(convert(err));
};
