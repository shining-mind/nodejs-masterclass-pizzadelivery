const path = require('path');
const Storage = require('../lib/store/Storage');

const storage = new Storage(path.resolve(__dirname, '..', 'storage', 'app'));

module.exports = storage;
