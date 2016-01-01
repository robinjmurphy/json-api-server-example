'use strict';

function sortToOrder(sort) {
  const reverse = /^-/.test(sort);
  let order = sort.replace(/^-/g, '');

  order += reverse ? ' desc' : ' asc';

  return order;
}

/**
 * Takes a JSON API query string object and converts
 * it into a set of options for Massive's `find` method
 */
module.exports = function optionsFromQuery(query) {
  const options = {};

  if (query.sort) {
    /*
     * Massive expects an array of fields to sort on.
     * This line converts a query string value into an array.
     * e.g. 'surname,-name' becomes ['surname asc', 'name desc']
     */
    options.order = query.sort.split(',').map(sortToOrder);
  }

  if (query.page) {
    const size = query.page.size;
    const number = query.page.number;

    options.limit = size;
    options.offset = size * (number - 1);
  }

  return options;
};
