'use strict';

const Joi = require('joi');
const person = require('./person');

module.exports = Joi.object().keys({
  data: Joi.object().keys({
    type: Joi.string().valid('people').required(),
    attributes: person.requiredKeys('name', 'surname')
  })
});
