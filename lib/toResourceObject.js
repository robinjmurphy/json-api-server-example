'use strict';

const baseURL = require('../config').baseURL;
const _ = require('lodash');

module.exports = function toResourceObject(person) {
  return {
    type: 'people',
    id: person.id,
    attributes: _.pick(person, 'name'),
    links: {
      self: `${baseURL}/people/${person.id}`
    }
  };
};
