'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports = function validator(property, schema) {
  return function validate(req, res, next) {
    const result = Joi.validate(req[property], schema);

    if (result.error) {
      return next(Boom.badRequest(result.error.details.pop().message));
    }

    req[property] = result.value;
    next();
  };
};
