'use strict';

const express = require('express');
const Boom = require('boom');
const errorHandler = require('./lib/errorHandler');
const people = require('./routes/people');
const logger = require('./lib/logger');

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

app.use('/people', people);

app.use((req, res, next) => {
  next(Boom.notFound(`Could not ${req.method} ${req.path}`));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening at http://127.0.0.1:${port}`);
});
