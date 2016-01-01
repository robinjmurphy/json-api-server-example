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
  const links = {};
  let next;
  let prev;

  const first = 1;
  const last = Math.max(Math.floor(total / size), 1);

  if (number < last) {
    next = number + 1;
  }

  if (number > first) {
    prev = number - 1;
  }

  links.first = createLink(req, first);
  links.last = createLink(req, last);
  if (prev) links.prev = createLink(req, prev);
  if (next) links.next = createLink(req, next);

  return links;
};
