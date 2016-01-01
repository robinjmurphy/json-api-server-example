'use strict';

const router = require('express').Router();
const Boom = require('boom');
const BodyParser = require('body-parser');

const contentType = 'application/vnd.api+json';

const bodyParser = BodyParser.json({
  type: contentType
});

function setContentType(req, res, next) {
  res.set('content-type', contentType);
  next();
}

function validateContentType(req, res, next) {
  if (['PATCH', 'POST'].indexOf(req.method) > 0 && !req.is(contentType)) {
    return next(Boom.unsupportedMediaType(`Content-Type must be set to ${contentType}`));
  }

  next();
}

router.use(validateContentType);
router.use(bodyParser);
router.use(setContentType);

module.exports = router;
