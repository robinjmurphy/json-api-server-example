'use strict';

const _ = require('lodash');

/*
 * Takes a JSON API query string object and converts
 * it into a set of constraints for Massive's `find` method
 */
module.exports = function constraintsFromQuery(query) {
  /*
   * Filter values can contain multiple values separated by
   * a comma (e.g. filter[name]=Ron,Arthur). Splitting them
   * into an array makes them work with Massive.
   */
  return _.mapValues(query.filter, (value) => value.split(','));
};
