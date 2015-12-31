'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports = function validator(schema) {
  return function validate(req, res, next) {
    const result = Joi.validate(req.body, schema);

    if (result.error) {
      return next(Boom.badRequest(result.error.details.pop().message));
    }

    next();
  };
};
