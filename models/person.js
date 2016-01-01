'use strict';

const async = require('async');
const db = require('../lib/db');
const optionsFromQuery = require('../lib/optionsFromQuery');
const constraintsFromQuery = require('../lib/constraintsFromQuery');

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

module.exports.all = function all(query, cb) {
  const constraints = constraintsFromQuery(query);
  const options = optionsFromQuery(query);

  async.parallel({
    people: function getData(done){
      db.people.find(constraints, options, done);
    },
    count: function getCount(done) {
      db.people.count(constraints, done);
    }
  }, (err, results) => {
    cb(err, results.people, results.count);
  });
};

module.exports.destroy = function destroy(id, cb) {
  db.people.destroy({ id }, cb);
};
