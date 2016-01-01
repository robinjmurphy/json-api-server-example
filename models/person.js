'use strict';

const db = require('../lib/db');

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.update = function update(id, data, cb) {
  db.people.update({ id }, data, cb);
};

module.exports.all = function all(opts, cb) {
  const constraints = opts.filter;

  db.people.find(constraints, cb);
};

module.exports.destroy = function destroy(id, cb) {
  db.people.destroy({ id }, cb);
};
