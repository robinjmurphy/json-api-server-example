'use strict';

const router = require('express').Router();
const _ = require('lodash');
const Person = require('../models/person');
const validate = require('../lib/validator');
const paginationLinks = require('../lib/paginationLinks');
const baseURL = require('../config').baseURL;
const createSchema = require('../schemas/createPerson');
const updateSchema = require('../schemas/updatePerson');
const querySchema = require('../schemas/queryPeople');

function toResourceObject(person) {
  return {
    type: 'people',
    id: person.id.toString(),
    attributes: _.omit(person, 'id'),
    links: {
      self: `${baseURL}/people/${person.id}`
    }
  };
}

router.get('/', validate('query', querySchema), (req, res, next) => {
  const opts = req.query;

  Person.all(opts, (err, people, total) => {
    if (err) return next(err);

    res.json({
      links: paginationLinks(req, total),
      data: people.map(toResourceObject)
    });
  });
});

router.post('/', validate('body', createSchema), (req, res, next) => {
  const attributes = req.body.data.attributes;

  Person.create(attributes, (err, person) => {
    if (err) return next(err);

    res.status(201)
      .set('Location', `${baseURL}/people/${person.id}`)
      .json({ data: toResourceObject(person) });
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Person.find(id, (err, person) => {
    if (err) return next(err);
    if (!person) return next();

    res.json({ data: toResourceObject(person) });
  });
});

router.patch('/:id', validate('body', updateSchema), (req, res, next) => {
  const id = req.body.data.id;
  const attributes = req.body.data.attributes;

  Person.update(id, attributes, (err, person) => {
    if (err) return next(err);
    if (!person) return next();

    res.json({ data: toResourceObject(person) });
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  Person.destroy(id, (err) => {
    if (err) return next(err);

    res.sendStatus(204);
  });
});

module.exports = router;
