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

function fromResourceObject(resourceObject) {
  return Object.assign({}, resourceObject.attributes);
}

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
  const data = fromResourceObject(req.body.data);

  Person.create(data, (err, person) => {
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

module.exports = router;
