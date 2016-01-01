'use strict';

const db = require('../lib/db');

function optionsFromQuery(query) {
  const options = {};

  if (query.sort) {
    const reverse = /^-/.test(query.sort);
    options.order = query.sort.replace(/^-/g, '');
    options.order += reverse ? ' desc' : ' asc';
  }

  return options;
}

module.exports.find = function get(id, cb) {
  db.people.findOne({ id }, cb);
};

module.exports.create = function create(data, cb) {
  db.people.insert(data, cb);
};

module.exports.update = function update(id, data, cb) {
  db.people.update({ id }, data, cb);
};

module.exports.all = function all(query, cb) {
  const constraints = query.filter;
  const options = optionsFromQuery(query);

  db.people.find(constraints, options, cb);
};

module.exports.destroy = function destroy(id, cb) {
  db.people.destroy({ id }, cb);
};
