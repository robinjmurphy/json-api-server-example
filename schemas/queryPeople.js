'use strict';

const Joi = require('joi');
const person = require('./person');
const sorts = /^(-?(id|name|surname|created),?)+$/;

module.exports = Joi.object().keys({
  filter: person.default({}),
  sort: Joi.string().regex(sorts).default('id'),
  page: Joi.object().keys({
    number: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).default(10)
  }).default({
    number: 1,
    size: 10
  })
});
