'use strict';

const assert = require('assert');
const app = require('..');
const request = require('supertest');
const async = require('async');
const Massive = require('massive');
const connectionString = require('../config').connectionString;

const massive = Massive.connectSync({ connectionString : connectionString });

const ron = { name: 'Ron' };
const ginny = { name: 'Ginny' };
const arthur = { name: 'Arthur' };

function setupDatabase(cb) {
  async.series([
    function createTable(done) {
      massive.createTable(done);
    },
    function insertData(done) {
      massive.people.insert([
        { data: ron },
        { data: ginny },
        { data: arthur}
      ], done);
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
        done();
      });
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
        done();
      });
  });

  it('returns a 404 when a person cannot be found', (done) => {
    request(app)
      .get('/people/1000')
      .expect(404, done);
  });
});
