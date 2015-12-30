'use strict';

const Massive = require('massive');
const connectionString = require('../config').connectionString;

const massive = Massive.connectSync({ connectionString });

module.exports.getPeople = function getPeople(cb) {
  massive.people.find(cb);
};

module.exports.createPerson = function createPerson(data, cb) {
  massive.people.insert({ data }, cb);
};

module.exports.getPerson = function getPerson(id, cb) {
  massive.people.findOne({ id }, cb);
};
