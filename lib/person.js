'use strict';

const db = require('./db');

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.all = function all(cb) {
  db.people.find(cb);
};
