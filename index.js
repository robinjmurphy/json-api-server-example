'use strict';

const express = require('express');
const logger = require('winston');
const Boom = require('boom');
const bodyParser = require('body-parser');
const errorHandler = require('./lib/errorHandler');
const People = require('./lib/people');
const toResourceObject = require('./lib/toResourceObject');

const app = module.exports = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.set('content-type', 'application/vnd.api+json');
  next();
});

app.get('/', (req, res) => {
  res.redirect('/people');
});

app.get('/people', (req, res, next) => {
  People.all((err, people) => {
    if (err) return next(err);

    res.json({ data: people.map(toResourceObject) });
  });
});

app.post('/people', bodyParser.json(), (req, res, next) => {
  People.create(req.body.data.attributes, (err, person) => {
    if (err) return next(err);

    res.status(201).json({ data: toResourceObject(person) });
  });
});

app.get('/people/:id', (req, res, next) => {
  const id = req.params.id;

  People.get(id, (err, person) => {
    if (err) return next(err);
    if (!person) return next();

    res.json({ data: toResourceObject(person) });
  });
});

app.use((req, res, next) => {
  next(Boom.notFound(`Could not ${req.method} ${req.path}`));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening at http://127.0.0.1:${port}`);
});
