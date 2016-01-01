'use strict';

const Joi = require('joi');
const person = require('./person');
const sorts = /-?(id|name|surname|created)/;

module.exports = Joi.object().keys({
  filter: person,
  sort: Joi.string().regex(sorts).default('id')
});
