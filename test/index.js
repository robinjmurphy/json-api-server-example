'use strict';

const app = require('..');
const request = require('supertest');

describe('GET /', () => {
  it('redirects to /people', (done) => {
    request(app)
      .get('/')
      .expect(302)
      .expect('Location', '/people')
      .end(done);
  });
});
