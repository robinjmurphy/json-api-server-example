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
