'use strict';

/**
 * Takes a JSON API query string object and converts
 * it into a set of options for Massive's `find` method
 */
module.exports = function optionsFromQuery(query) {
  const options = {};

  if (query.sort) {
    const reverse = /^-/.test(query.sort);

    options.order = query.sort.replace(/^-/g, '');
    options.order += reverse ? ' desc' : ' asc';
  }

  if (query.page) {
    const size = query.page.size;
    const number = query.page.number;

    options.limit = size;
    options.offset = size * (number - 1);
  }

  return options;
};
