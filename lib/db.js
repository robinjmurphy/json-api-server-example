'use strict';

const Massive = require('massive');
const config = require('../config');
const connectionString = process.env.DB || config.connectionString;

module.exports = Massive.connectSync({ connectionString });
