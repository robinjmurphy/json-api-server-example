'use strict';

const Joi = require('joi');
const db = require('../lib/db');

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.all = function all(cb) {
  db.people.find(cb);
};

module.exports.schema = Joi.object().keys({
  id: Joi.number().integer(),
  name: Joi.string().required()
});