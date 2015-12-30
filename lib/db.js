'use strict';

const Massive = require('massive');
const connectionString = require('../config').connectionString;

const massive = Massive.connectSync({ connectionString : connectionString });

function toResourceObject(row) {
  return {
    type: 'people',
    id: row.id,
    attributes: row.data
  };
}

module.exports.getPeople = function getPeople(cb) {
  massive.people.find((err, rows) => {
    if (err) return cb(err);

    cb(null, rows.map(toResourceObject));
  });
};
