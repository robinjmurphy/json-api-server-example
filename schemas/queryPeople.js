'use strict';

const Joi = require('joi');
const person = require('./person');

module.exports = Joi.object().keys({
  filter: person
});
