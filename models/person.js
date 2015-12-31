'use strict';

const db = require('../lib/db');

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.update = function update(id, data, cb) {
  const person = Object.assign({}, data, { id });

  db.people.update(person, cb);
};

module.exports.all = function all(cb) {
  db.people.find(cb);
};

module.exports.destroy = function destroy(id, cb) {
  db.people.destroy({ id }, cb);
};
