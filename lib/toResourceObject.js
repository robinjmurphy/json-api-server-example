'use strict';

const baseURL = require('../config').baseURL;

module.exports = function toResourceObject(person) {
  return {
    type: 'people',
    id: person.id,
    attributes: person.data,
    links: {
      self: `${baseURL}/people/${person.id}`
    }
  };
};
