'use strict';

const assert = require('assert');
const app = require('..');
const request = require('supertest');
const async = require('async');
const db = require('../lib/db');

const ron = { name: 'Ron', surname: 'Weasley' };
const ginny = { name: 'Ginny', surname: 'Weasley' };
const arthur = { name: 'Arthur', surname: 'Weasley' };

function setupDatabase(cb) {
  async.series([
    function createTable(done) {
      db.createTable(done);
    },
    function insertData(done) {
      db.people.insert([ron, ginny, arthur], done);
    }
  ], cb);
}

describe('GET /people', () => {
  beforeEach(setupDatabase);

  it('returns a list of people', (done) => {
    request(app)
      .get('/people')
      .expect(200)
      .end((err, res) => {
        assert.ifError(err);
        const people = res.body.data;
        assert.equal(people.length, 3);
        assert.equal(people[0].type, 'people');
        assert.equal(people[0].id, '1');
        assert.equal(people[0].attributes.name, 'Ron');
        assert.equal(people[0].attributes.surname, 'Weasley');
        done();
      });
  });

  it('uses the JSON API content type', (done) => {
    request(app)
      .get('/people')
      .expect(200)
      .expect('Content-Type', /application\/vnd\.api\+json/)
      .end(done);
  });
});

describe('POST /people', () => {
  beforeEach(setupDatabase);

  it('creates a person', (done) => {
    const body = {
      data: {
        type: 'people',
        attributes: {
          name: 'Fred',
          surname: 'Weasley'
        }
      }
    };

    async.series([
      function createPerson(cb) {
        request(app)
          .post('/people')
          .set('content-type', 'application/vnd.api+json')
          .send(JSON.stringify(body))
          .expect(201)
          .end((err, res) => {
            assert.ifError(err);
            assert.equal(res.body.data.type, 'people');
            assert.equal(res.body.data.id, 4);
            assert.equal(res.body.data.attributes.name, 'Fred');
            assert.equal(res.body.data.attributes.surname, 'Weasley');
            cb();
          });
      },
      function verifyPerson(cb) {
        db.people.findOne(4, (err, person) => {
          assert.ifError(err);
          assert.ok(person);
          assert.equal(person.name, 'Fred');
          cb();
        });
      }
    ], done);
  });

  it('returns a 400 error when the body is incorrectly formatted', (done) => {
    request(app)
      .post('/people')
      .set('content-type', 'application/vnd.api+json')
      .send(JSON.stringify({
        not: 'JSON API'
      }))
      .expect(400, done);
  });

  it('returns a 400 error when the person is invalid', (done) => {
    request(app)
      .post('/people')
      .set('content-type', 'application/vnd.api+json')
      .send(JSON.stringify({
        data: {
          type: 'people',
          attributes: {
            foo: 'bar'
          }
        }
      }))
      .expect(400, done);
  });

  it('returns a 415 error when the incorrect content type is used', (done) => {
    request(app)
      .post('/people')
      .send({})
      .expect(415, done);
  });
});

describe('GET /people/:id', () => {
  beforeEach(setupDatabase);

  it('returns a person', (done) => {
    request(app)
      .get('/people/2')
      .expect(200)
      .end((err, res) => {
        assert.ifError(err);
        const person = res.body.data;
        assert.equal(person.type, 'people');
        assert.equal(person.id, '2');
        assert.equal(person.attributes.name, 'Ginny');
        assert.equal(person.attributes.surname, 'Weasley');
        done();
      });
  });

  it('returns a 404 when a person cannot be found', (done) => {
    request(app)
      .get('/people/1000')
      .expect(404, done);
  });
});

describe('PATCH /people/:id', () => {
  it('updates a person', (done) => {
    async.series([
      function updatePerson(cb) {
        request(app)
          .patch('/people/1')
          .set('content-type', 'application/vnd.api+json')
          .send(JSON.stringify({
            data: {
              type: 'people',
              id: 2,
              attributes: {
                surname: 'Potter'
              }
            }
          }))
          .expect(200, cb);
      },
      function verifyUpdate(cb) {
        db.people.find(2, (err, person) => {
          assert.ifError(err);
          assert.equal(person.name, 'Ginny');
          assert.equal(person.surname, 'Potter');
          cb();
        });
      }
    ], done);
  });
});

describe('DELETE /people/:id', () => {
  beforeEach(setupDatabase);

  it('deletes a person', (done) => {
    async.series([
      function deletePerson(cb) {
        request(app)
          .delete('/people/1')
          .expect(204, cb);
      },
      function verifyDelete(cb) {
        db.people.findOne(1, (err, person) => {
          assert.ifError(err);
          assert.strictEqual(person, undefined);
          cb();
        });
      }
    ], done);
  });
});
