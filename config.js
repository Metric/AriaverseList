'use strict';

const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'properties.json');
const c = JSON.parse(fs.readFileSync(p, "utf8"));

module.exports = exports = c;