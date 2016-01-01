'use strict';

const baseURL = require('../config').baseURL;
const qs = require('qs');

function createLink(req, number) {
  const query = Object.assign({}, req.query);
  const url = baseURL + req.baseUrl + req.path;

  query.page.number = number;

  return `${url}?${qs.stringify(query, { encode: false })}`;
}

/**
 * Generates the JSON API links object for a collection
 * based on the Express request and the total number of records
 */
module.exports = function paginationLinks(req, total) {
  const number = req.query.page.number;
  const size = req.query.page.size;
  const last = Math.max(Math.floor(total / size), 1);

  const links = {
    first: createLink(req, 1),
    last: createLink(req, last)
  };

  if (number > 1) {
    links.prev = createLink(req, number - 1);
  }

  if (number < last) {
    links.next = createLink(req, number + 1);
  }

  return links;
};
