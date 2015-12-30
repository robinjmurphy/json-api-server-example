'use strict';

const db = require('./db');

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(attributes, cb) {
  db.people.insert({ data: attributes }, cb);
};

module.exports.all = function all(cb) {
  db.people.find(cb);
};
