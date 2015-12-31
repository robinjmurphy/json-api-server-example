'use strict';

const router = require('express').Router();
const bodyParser = require('body-parser');
const Joi = require('joi');
const _ = require('lodash');
const Person = require('../models/person');
const validate = require('../lib/validator');
const baseURL = require('../config').baseURL;

const createSchema = Joi.object().keys({
  data: Joi.object().keys({
    type: 'people',
    attributes: Person.schema
  })
});

function toResourceObject(person) {
  return {
    type: 'people',
    id: person.id,
    attributes: _.pick(person, 'name'),
    links: {
      self: `${baseURL}/people/${person.id}`
    }
  };
}

router.get('/', (req, res, next) => {
  Person.all((err, people) => {
    if (err) return next(err);

    res.json({ data: people.map(toResourceObject) });
  });
});

router.post('/', bodyParser.json(), validate(createSchema), (req, res, next) => {
  const attributes = req.body.data.attributes;

  Person.create(attributes, (err, person) => {
    if (err) return next(err);

    res.status(201).json({ data: toResourceObject(person) });
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  Person.destroy(id, (err) => {
    if (err) return next(err);

    res.sendStatus(204);
  });
});

module.exports = router;
