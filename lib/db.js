'use strict';

const Massive = require('massive');

module.exports = Massive.connectSync({
  connectionString: require('../config').connectionString
});
