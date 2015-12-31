'use strict';

const Joi = require('joi');
const db = require('../lib/db');

const schema = Joi.object().keys({
  id: Joi.number().integer(),
  name: Joi.string().required()
});

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.all = function all(cb) {
  db.people.find(cb);
};

module.exports.destroy = function destroy(id, cb) {
  db.people.destroy({ id }, cb);
};

module.exports.schema = schema;
