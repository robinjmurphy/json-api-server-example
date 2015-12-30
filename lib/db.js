'use strict';

const Massive = require('massive');
const connectionString = require('../config').connectionString;

const massive = Massive.connectSync({ connectionString : connectionString });

module.exports.getPeople = function getPeople(cb) {
  massive.people.find(cb);
};

module.exports.getPerson = function getPeople(id, cb) {
  massive.people.findOne({ id: id }, cb);
};
