'use strict';

const path = require('path');

const {
    run,
} = require('./lib/tests');

run(path.join(__dirname));
