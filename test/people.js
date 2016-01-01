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
      .expect('content-type', /application\/vnd\.api\+json/)
      .end(done);
  });

  describe('Filtering', () => {
    it('supports filtering by name', (done) => {
      request(app)
        .get('/people?filter[name]=Ron')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 1);
          assert.equal(res.body.data[0].attributes.name, 'Ron');
          done();
        });
    });

    it('supports filtering by surname', (done) => {
      request(app)
        .get('/people?filter[surname]=Weasley')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          done();
        });
    });

    it('supports filtering with multiple values', (done) => {
      request(app)
        .get('/people?filter[name]=Ron,Ginny')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 2);
          assert.equal(res.body.data[0].attributes.name, 'Ron');
          assert.equal(res.body.data[1].attributes.name, 'Ginny');
          done();
        });
    });

    it('returns a 400 error when passed an invalid filter', (done) => {
      request(app)
        .get('/people?filter[hairColour]=orange')
        .expect(400, done);
    });
  });

  describe('Sorting', () => {
    it('supports sorting by id', (done) => {
      request(app)
        .get('/people?sort=id')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          assert.equal(res.body.data[0].id, '1');
          assert.equal(res.body.data[1].id, '2');
          assert.equal(res.body.data[2].id, '3');
          done();
        });
    });

    it('supports sorting by name', (done) => {
      request(app)
        .get('/people?sort=name')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          assert.equal(res.body.data[0].attributes.name, 'Arthur');
          assert.equal(res.body.data[1].attributes.name, 'Ginny');
          assert.equal(res.body.data[2].attributes.name, 'Ron');
          done();
        });
    });

    it('supports sorting by created', (done) => {
      request(app)
        .get('/people?sort=created')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          assert.equal(res.body.data[0].id, '1');
          assert.equal(res.body.data[1].id, '2');
          assert.equal(res.body.data[2].id, '3');
          done();
        });
    });

    it('supports reverse sorting', (done) => {
      request(app)
        .get('/people?sort=-name')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          assert.equal(res.body.data[0].attributes.name, 'Ron');
          assert.equal(res.body.data[1].attributes.name, 'Ginny');
          assert.equal(res.body.data[2].attributes.name, 'Arthur');
          done();
        });
    });

    it('supports sorting by multiple fields', (done) => {
      request(app)
        .get('/people?sort=surname,-name')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 3);
          assert.equal(res.body.data[0].attributes.name, 'Ron');
          assert.equal(res.body.data[1].attributes.name, 'Ginny');
          assert.equal(res.body.data[2].attributes.name, 'Arthur');
          done();
        });
    });

    it('returns a 400 error when passed an invalid sort', (done) => {
      request(app)
        .get('/people?sort=-hairColour')
        .expect(400, done);
    });
  });

  describe('Pagination', () => {
    it('supports page-based pagination', (done) => {
      request(app)
        .get('/people?page[number]=2&page[size]=1')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 1);
          assert.equal(res.body.data[0].id, '2');
          done();
        });
    });

    it('returns pagination links', (done) => {
      request(app)
        .get('/people?page[number]=2&page[size]=1')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.ok(res.body.links);
          assert.equal(res.body.links.first, 'http://127.0.0.1:3000/people/?page[number]=1&page[size]=1&sort=id');
          assert.equal(res.body.links.last, 'http://127.0.0.1:3000/people/?page[number]=3&page[size]=1&sort=id');
          assert.equal(res.body.links.prev, 'http://127.0.0.1:3000/people/?page[number]=1&page[size]=1&sort=id');
          assert.equal(res.body.links.next, 'http://127.0.0.1:3000/people/?page[number]=3&page[size]=1&sort=id');
          done();
        });
    });

    it('supports pagination and sorting together', (done) => {
      request(app)
        .get('/people?page[number]=2&page[size]=2&sort=surname,name')
        .expect(200)
        .end((err, res) => {
          assert.ifError(err);
          assert.equal(res.body.data.length, 1);
          assert.equal(res.body.data[0].attributes.name, 'Ron');
          done();
        });
    });
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
          .expect('location', 'http://127.0.0.1:3000/people/4')
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

  it('returns a 400 error when the request body is invalid', (done) => {
    request(app)
      .patch('/people/1')
      .set('content-type', 'application/vnd.api+json')
      .send(JSON.stringify({
        foo: 'bar'
      }))
      .expect(400, done);
  });

  it('returns a 400 error when the person is invalid', (done) => {
    request(app)
      .patch('/people/1')
      .set('content-type', 'application/vnd.api+json')
      .send(JSON.stringify({
        data: {
          type: 'people',
          id: 1,
          attributes: {
            hairColour: 'orange'
          }
        }
      }))
      .expect(400, done);
  });

  it('returns a 415 when the incorrect content type is used', (done) => {
    request(app)
      .post('/people')
      .send({})
      .expect(415, done);
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
