'use strict';

const Massive = require('massive');
const config = require('../config');
const connectionString = config.connectionString;

module.exports = Massive.connectSync({ connectionString });
